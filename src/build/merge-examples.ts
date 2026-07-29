import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';

export interface MergeConfig {
    inputs: string[]
    output: string
}

export const MERGE_CONFIGS: MergeConfig[] = [
    { inputs: ['mips/es_ep.json', 'mips/es_ep_native.json', 'mips/es_ep2.json', 'mips/es_ep2_native.json', 'mips/es_poc.json', 'mips/es_poc_native.json'],
        output: 'mips/default.json' },
    { inputs: ['mips/es_ep_instructive.json', 'mips/es_poc_instructive.json', 'mips/es_ep2_instructive.json'],
        output: 'mips/default_instructive.json' },
    { inputs: ['rv32/es_ep.json', 'rv32/es_ep_native.json', 'rv32/es_ep2.json', 'rv32/es_ep2_native.json', 'rv32/es_poc.json', 'rv32/es_poc_native.json', 'rv32/es_rv.json'],
        output: 'rv32/default.json' },
    { inputs: ['rv32/es_ep_instructive.json', 'rv32/es_poc_instructive.json', 'rv32/es_ep2_instructive.json'],
        output: 'rv32/default_instructive.json' },
    { inputs: ['arm/es_ep.json', 'arm/es_ep2.json'],
        output: 'arm/default.json' },
    { inputs: ['z80/es_ep.json', 'z80/es_ep2.json'],
        output: 'z80/default.json' },
    { inputs: ['mips_ocw/es_ep.json', 'mips_ocw/es_ep2.json'],
        output: 'mips_ocw/default.json' },
    { inputs: ['rv32_ag/es_ep.json', 'rv32_ag/es_poc.json', 'rv32_ag/es_ep2.json'],
        output: 'rv32_ag/default.json' },
];

export function merge_example_sets(srcBase: string, destBase: string, configs: MergeConfig[] = MERGE_CONFIGS): void
{
    for (const cfg of configs)
    {
        const result: any[] = [];
        for (const input of cfg.inputs)
        {
            const filePath = path.resolve(srcBase, input);
            const data     = JSON.parse(readFileSync(filePath, 'utf-8'));
            if (Array.isArray(data))
            {
                result.push(...data);
            }
        }
        const outputPath = path.resolve(destBase, cfg.output);
        mkdirSync(path.dirname(outputPath), { recursive: true });
        writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
    }
}
