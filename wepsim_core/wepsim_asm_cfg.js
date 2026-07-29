/*
 *  Copyright 2015-2026 The WepSIM team (see docs/WEPSIM-TEAM.md)
 *
 *  This file is part of WepSIM.
 *
 *  WepSIM is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WepSIM is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Control Flow Graph (CFG) module for WepSIM assembly.
 *
 * Builds a CFG from the assembler output (basic blocks + edges),
 * computes a layered layout, and renders it via vis-network.
 */

import { get_simware } from '../sim_core/sim_adt_core.js';

/**
 * Return the current firmware candidate from an elto, or null.
 * @param {Object} elto
 * @returns {Object|null}
 */
function get_firm_candidate(elto)
{
    if (elto.firm_reference && elto.firm_reference_index >= 0)
        return elto.firm_reference[elto.firm_reference_index];
    return null;
}

/**
 * Determine the CFG type of an instruction elto.
 * Priority: elto.cfg_type > firm candidate cfg_type > null.
 * @param {Object} elto
 * @returns {string|null} 'branch' | 'call' | 'jump' | 'return' | null
 */
function get_cfg_type(elto)
{
    if (elto.datatype !== 'instruction') return null;

    if (elto.cfg_type) return elto.cfg_type;

    var candidate = get_firm_candidate(elto);
    if (candidate && candidate.cfg_type) return candidate.cfg_type;

    return null;
}

/**
 * Get the last underlying elto of a basic block.
 * Each block item wraps one or more eltos (pseudo-instruction expansion).
 * @param {Object} block
 * @returns {Object}
 */
function last_elto(block)
{
    return block.items[block.items.length - 1].last_elto;
}

/**
 * Shorthand for get_cfg_type(last_elto(block)).
 * @param {Object} block
 * @returns {string|null}
 */
function last_cfg_type(block)
{
    return get_cfg_type(last_elto(block));
}

/**
 * Extract branch-target labels from an instruction elto.
 * Two strategies, tried in order:
 *   1. Scan elto.pending for field-instruction entries with .rel (relative labels).
 *   2. Fallback: find the field named by the firm candidate cfg_addr.
 * @param {Object} elto
 * @returns {Array<{label: string}>}
 */
function get_branch_targets(elto)
{
    if (elto.value && elto.value.fields)
    {
        var candidate = get_firm_candidate(elto);
        if (candidate && candidate.cfg_addr)
        {
            var fieldIdx = candidate.fields.findIndex(function(f)
            {
                return f.name === candidate.cfg_addr;
            });
            if (fieldIdx !== -1)
            {
                var label = elto.value.fields[fieldIdx];
                if (label && typeof label === 'string')
                    return [{ label: label }];
            }
        }
    }
    return [];
}

/**
 * Flatten ret.obj into a uniform items array.
 * Only .text instructions/pseudoinstructions are kept.
 * Consecutive eltos belonging to the same pseudo-instruction
 * (same associated_pseudo reference) are merged into a single item.
 * @param {Object} ret - assembler output
 * @returns {Array}
 */
function extract_items(ret)
{
    var items = [];

    for (var i = 0; i < ret.obj.length; i++)
    {
        var elto = ret.obj[i];
        if (elto.datatype !== 'instruction' && elto.datatype !== 'pseudoinstruction') continue;

        var last_item = items[items.length - 1];

        if (elto.associated_pseudo &&
            last_item && last_item.is_pseudo &&
            last_item.eltos[0].associated_pseudo === elto.associated_pseudo)
        {
            last_item.eltos.push(elto);
            last_item.last_elto = elto;
            continue;
        }

        items.push({
            id:        items.length,
            is_pseudo: !!elto.associated_pseudo,
            source:    elto.associated_pseudo ?
                elto.associated_pseudo.source :
                elto.source,
            labels:    elto.labels || [],
            eltos:     [elto],
            last_elto: elto,
        });
    }
    return items;
}

/**
 * Build the full CFG from the assembler output `ret`.
 *
 * Pipeline:
 *   1. Extract items from ret.obj
 *   2. Find basic-block leaders (first line, label targets, after branches)
 *   3. Slice items into blocks
 *   4. Build control-flow edges (branch/call/jump targets + fallthrough)
 *   5. Walk each callee to find return blocks
 *   6. Wire return edges back to the caller fallthrough
 *
 * @param {Object} ret - assembler output with .obj array
 * @returns {Object|null} { blocks, edges } or null
 */
function compute_cfg(ret)
{
    if (!ret || !ret.obj)
        return null;

    var items = extract_items(ret);

    if (items.length === 0)
        return { blocks: [], edges: [] };

    // find leaders (first line, label targets, after branches)
    var leaders = {};
    leaders[0]  = true;
    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        if (item.labels && item.labels.length > 0)
            leaders[i] = true;
        if (get_cfg_type(item.last_elto) !== null)
        {
            leaders[i] = true;
            if (i + 1 < items.length)
                leaders[i + 1] = true;
        }
    }

    var sorted_leaders = Object.keys(leaders).map(Number).sort(function(a, b)
    {
        return a - b;
    });

    // build basic blocks from leaders
    var blocks = [];
    for (var i = 0; i < sorted_leaders.length; i++)
    {
        var start = sorted_leaders[i];
        var end   = (i + 1 < sorted_leaders.length) ?
            sorted_leaders[i + 1] :
            items.length;
        blocks.push({
            id:           i,
            item_start:   start,
            items:        items.slice(start, end),
            entry_labels: items[start].labels || [],
        });
    }

    // map label names to block ids
    var label_to_block = {};
    for (var i = 0; i < blocks.length; i++)
    {
        var block = blocks[i];
        for (var j = 0; j < block.entry_labels.length; j++)
            label_to_block[block.entry_labels[j]] = block.id;
    }

    // build edges between blocks
    var edges = [];
    for (var i = 0; i < blocks.length; i++)
    {
        var block = blocks[i];
        var type  = last_cfg_type(block);

        if (type === 'branch' || type === 'call' || type === 'jump')
        {
            var targets = get_branch_targets(last_elto(block));
            for (var j = 0; j < targets.length; j++)
            {
                var tid = label_to_block[targets[j].label];
                if (tid !== undefined)
                {
                    var e = { from: block.id, to: tid, label: targets[j].label };
                    if (type === 'call') e.is_call = true;
                    edges.push(e);
                }
            }
        }

        if (type === 'branch' || type === 'call')
        {
            if (i + 1 < blocks.length)
                edges.push({ from: block.id, to: blocks[i + 1].id, dashes: true });
        }
        else if (type === null)
        {
            if (i + 1 < blocks.length)
                edges.push({ from: block.id, to: blocks[i + 1].id });
        }
    }

    // collect call targets (label -> caller blocks) and their fallthroughs
    var call_targets     = {};
    var call_fallthrough = {};
    for (var i = 0; i < edges.length; i++)
    {
        var e        = edges[i];
        var src_type = last_cfg_type(blocks[e.from]);

        if (src_type === 'call' && !e.dashes && e.label)
        {
            if (!call_targets[e.label]) call_targets[e.label] = [];
            call_targets[e.label].push(e.from);
        }
        if (src_type === 'call' && e.dashes)
            call_fallthrough[e.from] = e.to;
    }

    // for each called function, walk its body to locate return blocks
    var func_entry_ret_blocks = {};
    for (var label in call_targets)
    {
        var target_id = label_to_block[label];
        if (target_id === undefined) continue;

        var visited_fn        = {};
        var fnq               = [target_id];
        visited_fn[target_id] = true;

        while (fnq.length > 0)
        {
            var fnbid  = fnq.shift();
            var fntype = last_cfg_type(blocks[fnbid]);

            if (fntype === 'return')
            {
                if (!func_entry_ret_blocks[target_id])
                    func_entry_ret_blocks[target_id] = [];
                func_entry_ret_blocks[target_id].push(fnbid);
            }

            // traverse outgoing edges (skipping call jumps and return edges)
            for (var j = 0; j < edges.length; j++)
            {
                var fe = edges[j];
                if (fe.from !== fnbid) continue;
                if (fe.return) continue;
                if (fntype === 'call' && !fe.dashes) continue;
                if (!visited_fn[fe.to])
                {
                    visited_fn[fe.to] = true;
                    fnq.push(fe.to);
                }
            }
        }
    }

    // wire return edges from each return block to the caller's fallthrough
    for (var label in call_targets)
    {
        var target_id = label_to_block[label];
        if (target_id === undefined) continue;
        var ret_blocks = func_entry_ret_blocks[target_id] || [];
        var callers    = call_targets[label];
        for (var i = 0; i < callers.length; i++)
        {
            var caller_id = callers[i];
            var ft_id     = call_fallthrough[caller_id];
            if (ft_id === undefined) continue;
            for (var j = 0; j < ret_blocks.length; j++)
            {
                edges.push({
                    from:   ret_blocks[j],
                    to:     ft_id,
                    return: true,
                });
            }
        }
    }

    return { blocks: blocks, edges: edges };
}

/**
 * Compute x/y pixel positions for each block.
 *
 * Layout algorithm:
 *   1. Separate edges into "call jumps" (move to next column) and "others".
 *   2. BFS from entry: non-call edges stay in the same column,
 *      call edges advance to the next column.
 *   3. Within each column, sort blocks by program order (item_start) -> rows.
 *   4. Vertically align each function entry with its first caller
 *      by shifting entire columns down.
 *   5. Convert (column, row) to pixel coordinates.
 * @param {Array} blocks
 * @param {Array} edges
 * @returns {Object} node_pos - map of block id -> {x, y}
 */
function compute_positions(blocks, edges)
{
    // classify edges: call jumps increment column, others keep same column
    var call_edges  = {};
    var other_edges = {};
    for (var i = 0; i < edges.length; i++)
    {
        var e = edges[i];
        if (e.return) continue;
        if (last_cfg_type(blocks[e.from]) === 'call' && !e.dashes)
        {
            if (!call_edges[e.from]) call_edges[e.from] = [];
            call_edges[e.from].push(e.to);
        }
        else
        {
            if (!other_edges[e.from]) other_edges[e.from] = [];
            other_edges[e.from].push({ to: e.to, dashes: e.dashes });
        }
    }

    // find entry point: look for 'main' label, fallback to block 0
    var entry_id = 0;
    for (var i = 0; i < blocks.length; i++)
    {
        if (blocks[i].entry_labels.indexOf('main') !== -1)
        {
            entry_id = blocks[i].id;
            break;
        }
    }

    // BFS assign columns:
    //   - non-call edges  -> same column
    //   - call edges      -> next column
    var column        = {};
    var visited       = {};
    var pending       = [entry_id];
    visited[entry_id] = true;
    column[entry_id]  = 0;

    while (pending.length > 0)
    {
        var bid    = pending.shift();
        var others = other_edges[bid];
        if (others)
        {
            for (var i = 0; i < others.length; i++)
            {
                if (!visited[others[i].to])
                {
                    visited[others[i].to] = true;
                    column[others[i].to]  = column[bid];
                    pending.push(others[i].to);
                }
            }
        }

        var calls = call_edges[bid];
        if (calls)
        {
            for (var i = 0; i < calls.length; i++)
            {
                if (!visited[calls[i]])
                {
                    visited[calls[i]] = true;
                    column[calls[i]]  = column[bid] + 1;
                    pending.push(calls[i]);
                }
            }
        }
    }

    // assign preliminary rows (by program order within each column)
    var col_blocks = {};
    for (var i = 0; i < blocks.length; i++)
    {
        var bid = blocks[i].id;
        if (column[bid] === undefined) column[bid] = 0;
        if (!col_blocks[column[bid]]) col_blocks[column[bid]] = [];
        col_blocks[column[bid]].push({ id: bid, item_start: blocks[i].item_start });
    }

    var row         = {};
    var sorted_cols = Object.keys(col_blocks).map(Number).sort(function(a, b)
    {
        return a - b;
    });
    for (var ci = 0; ci < sorted_cols.length; ci++)
    {
        var c = sorted_cols[ci];
        col_blocks[c].sort(function(a, b)
        {
            return a.item_start - b.item_start;
        });
        for (var ri = 0; ri < col_blocks[c].length; ri++)
            row[col_blocks[c][ri].id] = ri;
    }

    // shift each column down so function entry aligns with its first caller
    for (var ci = 1; ci < sorted_cols.length; ci++)
    {
        var c          = sorted_cols[ci];
        var min_needed = Infinity;

        for (var pci = 0; pci < ci; pci++)
        {
            var prev_c       = sorted_cols[pci];
            var prev_entries = col_blocks[prev_c];
            for (var i = 0; i < prev_entries.length; i++)
            {
                var this_bid  = prev_entries[i].id;
                var call_list = call_edges[this_bid];
                if (!call_list) continue;

                for (var j = 0; j < call_list.length; j++)
                {
                    var tgt_id = call_list[j];
                    if (column[tgt_id] !== c) continue;

                    var needed = row[this_bid] - row[tgt_id];
                    if (needed < min_needed) min_needed = needed;
                }
            }
        }

        if (min_needed > 0 && isFinite(min_needed))
        {
            var col_entries = col_blocks[c];
            for (var i = 0; i < col_entries.length; i++)
                row[col_entries[i].id] += min_needed;
        }
    }

    // convert (column, row) grid to pixel coordinates
    var lvl_gap   = 160;
    var blk_width = 300;
    var col_gap   = 80;
    var node_pos  = {};

    var col_x = {};
    for (var ci = 0; ci < sorted_cols.length; ci++)
    {
        var c    = sorted_cols[ci];
        col_x[c] = 20 + ci * (blk_width + col_gap);
    }

    for (var i = 0; i < blocks.length; i++)
    {
        var bid       = blocks[i].id;
        var c         = column[bid] !== undefined ? column[bid] : 0;
        node_pos[bid] = { x: col_x[c] || 20, y: 20 + (row[bid] || 0) * lvl_gap };
    }

    return node_pos;
}

/**
 * Return vis-network edge styling for a given edge descriptor.
 *
 * Edge types (checked in order):
 *   .return      - dashed orange return edge (curved clockwise)
 *   .dashes      - dashed green fall-through (curved CW, shallow)
 *   .is_call     - solid blue call jump (curved CW, medium)
 *   .label       - solid blue branch/jump (curved CW, wide)
 *   (none)       - straight gray sequential edge
 * @param {Object} e - edge descriptor
 * @returns {Object} vis-network edge style object
 */
function edge_style(e)
{
    if (e.return)
        return {
            dashes: [6, 3],
            smooth: { type: 'curvedCW', roundness: 0.45 },
            color:  { color: '#E65100' },
            width:  2,
            label:  '  return',
        };

    if (e.dashes)
        return {
            dashes: [8, 4],
            smooth: { type: 'curvedCW', roundness: 0.20 },
            color:  { color: '#43A047' },
            label:  '  fall-through',
        };

    if (e.is_call)
        return {
            smooth: { type: 'curvedCW', roundness: 0.40 },
            color:  { color: '#1565C0' },
            label:  '  ' + e.label,
            width:  3,
        };

    if (e.label)
        return {
            smooth: { type: 'curvedCW', roundness: 0.55 },
            color:  { color: '#1565C0' },
            label:  '  ' + e.label,
            width:  3,
        };

    return {
        smooth: { type: 'straightCross', roundness: 0 },
        color:  { color: '#9E9E9E' },
    };
}

/**
 * Build a CFG from the current firmware and render it into a DOM container
 * using vis-network.
 *
 * Steps:
 *   1. Fetch firmware via get_simware() and build CFG from it.
 *   2. If empty, show a placeholder message.
 *   3. Dynamically import vis-network (DataSet, Network, CSS).
 *   4. Compute positions for all blocks (layered layout).
 *   5. Build vis-network node array (box shapes, monospace labels).
 *   6. Build vis-network edge array with per-type styling.
 *   7. Instantiate Network with physics disabled (manual layout).
 *   8. Fit the view and return the Network instance.
 * @param {string} container_id - DOM element id
 * @returns {Promise<Object|undefined>} Network instance or undefined
 */
export async function render_asm_cfg(container_id)
{
    var cfg = compute_cfg(get_simware());

    if (!cfg || !cfg.blocks || cfg.blocks.length === 0)
    {
        console.log('No ASM');
        var container = document.getElementById(container_id);
        if (container)
            container.innerHTML = '<div style="padding:20px;text-align:center;color:#888;">' +
                'No ASM blocks to display</div>';
        return;
    }

    var { DataSet, Network, injectVisCSS } = await import('../src/lib/vis-network-lazy.js');
    injectVisCSS();

    var blocks    = cfg.blocks;
    var edges_b   = cfg.edges;
    var positions = compute_positions(blocks, edges_b);

    var block_colors = [
        { bg: '#E3F2FD', border: '#1565C0' },
        { bg: '#E8F5E9', border: '#2E7D32' },
        { bg: '#FFF3E0', border: '#E65100' },
        { bg: '#F3E5F5', border: '#6A1B9A' },
        { bg: '#E0F7FA', border: '#00838F' },
        { bg: '#FBE9E7', border: '#BF360C' },
        { bg: '#F1F8E9', border: '#558B2F' },
        { bg: '#EDE7F6', border: '#4527A0' },
    ];

    var nodes_arr = [];

    for (var i = 0; i < blocks.length; i++)
    {
        var block   = blocks[i];
        var palette = block_colors[i % block_colors.length];
        var pos     = positions[block.id] || { x: 0, y: 0 };

        var label_lines = [];
        if (block.entry_labels.length > 0)
            label_lines.push('<b>' + block.entry_labels[0] + ':</b>');

        for (var j = 0; j < block.items.length; j++)
            label_lines.push(block.items[j].source);

        nodes_arr.push({
            id:              block.id,
            label:           label_lines.join('\n'),
            shape:           'box',
            font:            { face: 'monospace', size: 11, multi: 'html' },
            margin:          { top: 4, bottom: 4, left: 8, right: 8 },
            color:           { background: palette.bg, border: palette.border },
            borderWidth:     2,
            x:               pos.x,
            y:               pos.y,
            shapeProperties: { borderRadius: 6 },
        });
    }

    var edges_arr = [];
    for (var i = 0; i < edges_b.length; i++)
    {
        var e     = edges_b[i];
        var style = edge_style(e);
        var edge  = {
            from:   e.from,
            to:     e.to,
            arrows: 'to',
            width:  2,
            font:   { face: 'monospace', size: 10, color: '#333', align: 'middle' },
        };
        Object.assign(edge, style);
        edges_arr.push(edge);
    }

    var container = document.getElementById(container_id);
    if (!container) return;

    var data = {
        nodes: new DataSet(nodes_arr),
        edges: new DataSet(edges_arr),
    };

    var options = {
        interaction: {
            hover:        true,
            dragNodes:    true,
            zoomView:     true,
            tooltipDelay: 200,
        },
        physics: {
            enabled: false,
        },
    };

    var network = new Network(container, data, options);
    network.fit({ animation: true });

    return network;
}
