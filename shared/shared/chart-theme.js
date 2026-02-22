/* Motor City Math — Chart.js Pistons Theme
 * Apply to all Chart.js instances for consistent Pistons palette.
 * Design system: .chart-spec.md §1
 */

var MCM_CHART_COLORS = {
    primary: '#1D42BA',
    secondary: '#C8102E',
    tertiary: '#002D62',
    grid: '#E2E5EF',
    label: '#1A1F36',
    labelLight: '#CCCCCC',
    point: '#C8102E',
    line: '#1D42BA',
    fill: 'rgba(29, 66, 186, 0.08)',
    target: '#C8CCD8',
    tooltip: '#002D62',
    tooltipText: '#FFFFFF',
    success: '#1B7D3A',
    warning: '#E8A317',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
};

/* Set Chart.js defaults to Pistons palette */
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = MCM_CHART_COLORS.fontFamily;
    Chart.defaults.font.size = 13;
    Chart.defaults.color = MCM_CHART_COLORS.label;
    Chart.defaults.borderColor = MCM_CHART_COLORS.grid;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    // Legend: hidden by default, enable per-chart
    Chart.defaults.plugins.legend.display = false;

    // Tooltip: navy background, clean styling
    Chart.defaults.plugins.tooltip.backgroundColor = MCM_CHART_COLORS.tooltip;
    Chart.defaults.plugins.tooltip.titleFont = { weight: '700', size: 13 };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 12 };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 4;
    Chart.defaults.plugins.tooltip.displayColors = false;

    // Points: visible, red accent
    Chart.defaults.elements.point.radius = 5;
    Chart.defaults.elements.point.hoverRadius = 7;

    // Lines: thick, straight segments
    Chart.defaults.elements.line.borderWidth = 3;
    Chart.defaults.elements.line.tension = 0;

    // Reduce motion if user prefers
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        Chart.defaults.animation = false;
    }
}

/* Arena mode palette swap */
function setChartMode(mode) {
    if (typeof Chart === 'undefined') return;
    var dark = mode === 'arena';
    Chart.defaults.color = dark ? MCM_CHART_COLORS.labelLight : MCM_CHART_COLORS.label;
}
