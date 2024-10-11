import React from 'react';

const TransactionsTable = ({ transactions, page, setPage, totalTransactions, perPage }) => {
  const totalPages = Math.ceil(totalTransactions / perPage);

  return (
    <div>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.ID}</td>
                  <td>{tx.title}</td>
                  <td>{tx.description.length > 50 ? tx.description.substring(0, 50) + '...' : tx.description}</td>
                  <td>${tx.price.toFixed(2)}</td>
                  <td>{tx.category}</td>
                  <td>{tx.sold ? 'Yes' : 'No'}</td>
                  <td>
                    <img 
                      src={tx.image} 
                      alt={tx.title} 
                      style={{ width: '10em', height: '10em', objectFit: 'cover' }} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTable;
