const AdminWelcomeSection = ({ userName }) => {
  return (
    <>
      <div className="welcome-card">
        <h2>Hey {userName}, welcome to your admin dashboard! 👋</h2>
        <p>Here's what you can do:</p>
        <ul>
          <li>
            📋 <strong>View all products</strong> - See a complete list of all
            products in the system
          </li>
          <li>
            ✏️ <strong>Edit product details</strong> - Click "Edit" on any
            product to modify its name and price
          </li>
          <li>
            💾 <strong>Save changes</strong> - Updates are sent to the server
            and reflected immediately
          </li>
          <li>
            🏠 <strong>Navigate back</strong> - Use the "Homepage" button to
            return to the main site
          </li>
        </ul>
      </div>

      <div className="admin-info-card">
        <h3>System Information</h3>
        <p>
          <strong>Authentication:</strong> JWT Token Active
        </p>
        <p>
          <strong>Access Level:</strong> Administrator
        </p>
      </div>
    </>
  )
}

export default AdminWelcomeSection