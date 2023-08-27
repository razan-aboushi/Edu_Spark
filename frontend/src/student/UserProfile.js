import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import "../css/UserProfile.css";


function UserProfile() {
  const [userProfile, setUserProfile] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = jwt_decode(token);
  const user_id = decodedToken.userId;


  useEffect(() => {
    const getUserProfile = async () => {
      try {

        const response = await axios.get(`http://localhost:4000/user-profile/${user_id}`);
        const formattedProfile = {
          ...response.data,
          birthdate: new Date(response.data.birthdate).toLocaleDateString(),
        };
        setUserProfile(formattedProfile);

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getUserProfile();
  }, [user_id]);


  return (
    <section id="UserProfile" className="mt-5">
      <div className="container-fluid d-flex justify-content-center mb-2">
        <div className="row">
          <div className="panel panel-defaultProfile p-0">
            <div className="panel-headingProfile text-center">
              <h4 className="text-white">الحساب الشخصي</h4>
            </div>
            <div className="panel-bodyUserProfile">

              <div className="col-md-12 col-xs-8 col-sm-12 col-lg-8" style={{ width: "350px" }}>
                <div className="ContainerProfileSection"></div>
                <hr />
                <ul className="ContainerProfileSection details" style={{ fontSize: "18px" }}>
                  <li>
                    <p>
                      <span className="bi bi-person one" style={{ width: 50 }} />
                      {userProfile.name}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="bi bi-envelope one" style={{ width: 50 }} />
                      {userProfile.email}
                    </p>
                  </li>
                  <hr />
                  <li>
                    <p>
                      <span className="bi bi-phone one" style={{ width: 50 }} />
                      {userProfile.phone_number}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="bi bi-calendar-date one" style={{ width: 50 }} />
                      {userProfile.birthdate}
                    </p>
                  </li>
                  <li>
                    <p>
                      {userProfile.gender === "female" ? (
                        <span className="fa fa-venus one" style={{ width: 50 }} /> // Use female icon
                      ) : (
                        <span className="fa fa-mars one" style={{ width: 50 }} /> // Use  male icon
                      )}
                      {userProfile.gender === "female" ? "أنثى" : "ذكر"}
                    </p>
                  </li>

                </ul>
                <hr />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;