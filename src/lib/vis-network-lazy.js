export { DataSet, Network } from 'vis-network/standalone';
import visCSS from 'vis-network/styles/vis-network.min.css?inline';
export function injectVisCSS()
{
    if (!document.getElementById('vis-network-css'))
    {
        var style         = document.createElement('style');
        style.id          = 'vis-network-css';
        style.textContent = visCSS;
        document.head.appendChild(style);
    }
}
