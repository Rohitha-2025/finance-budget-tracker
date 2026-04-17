// ReportTable - Renders a simple data table for reports
function ReportTable(props) {
  // props: columns (array of strings), rows (array of arrays)
  var columns = props.columns || [];
  var rows = props.rows || [];

  return (
    <table className="report-table">
      <thead>
        <tr>
          {columns.map(function (col, i) {
            return <th key={i}>{col}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map(function (row, ri) {
          return (
            <tr key={ri}>
              {row.map(function (cell, ci) {
                return <td key={ci}>{cell}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReportTable;
