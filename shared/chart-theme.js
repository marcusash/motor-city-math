/* Motor City Math — Chart.js Pistons Theme
 * Apply to all Chart.js instances for consistent Pistons palette.
 * Design system: .design-system.md §5
 */

var MCM_CHART_COLORS = {
    primary: '#1D42BA',
    secondary: '#C8102E',
    tertiary: '#002D62',
    grid: '#E0E0E0',
    label: '#333333',
    point: '#C8102E',
    line: '#1D42BA',
    fill: 'rgba(29, 66, 186, 0.08)'
};

/* Set Chart.js defaults to Pistons palette */
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = MCM_CHART_COLORS.label;
    Chart.defaults.borderColor = MCM_CHART_COLORS.grid;
    Chart.defaults.font.family = "'Helvetica Neue', Helvetica, Arial, sans-serif";
}
