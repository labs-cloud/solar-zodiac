import React from 'react';

interface TableColumn<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    onRowClick?: (item: T) => void;
    keyField?: keyof T;
}

export function Table<T extends Record<string, any>>({
    data,
    columns,
    onRowClick,
    keyField = 'id'
}: TableProps<T>) {
    return (
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    color: '#64748B'
                                }}
                                className={col.className}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((item, rowIdx) => (
                            <tr
                                key={String(item[keyField] || rowIdx)}
                                onClick={() => onRowClick && onRowClick(item)}
                                style={{
                                    borderBottom: rowIdx === data.length - 1 ? 'none' : '1px solid #E2E8F0',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    transition: 'background-color 0.1s'
                                }}
                                onMouseEnter={(e) => {
                                    if (onRowClick) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                }}
                                onMouseLeave={(e) => {
                                    if (onRowClick) e.currentTarget.style.backgroundColor = 'white';
                                }}
                            >
                                {columns.map((col, colIdx) => (
                                    <td key={colIdx} style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#334155' }}>
                                        {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
