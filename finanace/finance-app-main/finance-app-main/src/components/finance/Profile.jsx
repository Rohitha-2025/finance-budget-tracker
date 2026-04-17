import { useEffect, useState } from 'react';

// Profile - Display and edit user information
function Profile(props) {
  // props: user, onUpdateProfile
  var user = props.user || {};
  var initials = (user.fullName || 'U').charAt(0).toUpperCase();

  var [isEditing, setIsEditing] = useState(false);
  var [formData, setFormData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    username: user.username || '',
    accountType: user.accountType || 'Personal',
    photo: user.photo || null,
  });

  useEffect(function () {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      username: user.username || '',
      accountType: user.accountType || 'Personal',
      photo: user.photo || null,
    });
  }, [user.fullName, user.email, user.username, user.accountType, user.photo]);

  function handleInputChange(e) {
    var { name, value } = e.target;
    setFormData(function (prev) { return { ...prev, [name]: value }; });
  }

  function handlePhotoChange(e) {
    var file = e.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        setFormData(function (prev) { return { ...prev, photo: event.target.result }; });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (props.onUpdateProfile) {
      await props.onUpdateProfile(formData);
    }
    setIsEditing(false);
    alert('Profile updated successfully! ✅');
  }

  function handleCancel() {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      username: user.username || '',
      accountType: user.accountType || 'Personal',
      photo: user.photo || null,
    });
    setIsEditing(false);
  }

  var displayPhoto = formData.photo || user.photo;

  return (
    <div>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your account information</p>
      </div>

      <div className="card profile-card">
        {isEditing ? (
          <div>
            <div className="profile-photo-upload">
              {displayPhoto ? (
                <img src={displayPhoto} alt="Profile" className="profile-photo-img" />
              ) : (
                <div className="profile-avatar">{initials}</div>
              )}
              <input
                type="file"
                id="photoInput"
                accept="image/*"
                onChange={handlePhotoChange}
                className="photo-input"
              />
              <label htmlFor="photoInput" className="photo-label">Change Photo</label>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                >
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                  <option value="Family">Family</option>
                </select>
              </div>
              <div className="button-group">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profile" className="profile-photo-img" />
            ) : (
              <div className="profile-avatar">{initials}</div>
            )}
            <div className="profile-row">
              <span className="label">Full Name</span>
              <span className="value">{user.fullName || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email</span>
              <span className="value">{user.email || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Username</span>
              <span className="value">{user.username || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Account Type</span>
              <span className="value">{user.accountType || 'Personal'}</span>
            </div>
            <button className="btn-primary" onClick={function () { setIsEditing(true); }}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
