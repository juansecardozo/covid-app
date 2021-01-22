import React from "react";
import { useTable, useSortBy } from "react-table";
import { useHistory } from "react-router-dom";

export default function Table({
    columns,
    data,
    clickable = false,
    highlight = false
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable(
        {
            columns,
            data
        },
        useSortBy
    );
    const history = useHistory();
    const handleRowClick = row => {
        console.log(row);
        history.push(`/country/${row.original.countryInfo._id}`);
    };

    return (
        <>
            <table {...getTableProps()} className="table table-striped">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                >
                                    {column.render("Header")}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                onClick={
                                    clickable
                                        ? () => handleRowClick(row)
                                        : undefined
                                }
                                {...row.getRowProps()}
                                className={clickable ? "clickable" : ""}
                            >
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
