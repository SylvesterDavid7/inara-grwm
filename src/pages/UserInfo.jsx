import React, { useState, useEffect } from 'react';
import { useUserDataContext } from '../contexts/UserDataContext';
import { getAuth, updateProfile } from 'firebase/auth';

const UserInfo = () => {
  const { user, userData, updateUserData } = useUserDataContext();
  const auth = getAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');
  const [profileErrorMessage, setProfileErrorMessage] = useState('');

  // State for address fields
  const [mobileNumber, setMobileNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [flatHouseNo, setFlatHouseNo] = useState('');
  const [streetLocality, setStreetLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState('home');
  const [addressSuccessMessage, setAddressSuccessMessage] = useState('');
  const [addressErrorMessage, setAddressErrorMessage] = useState('');

  useEffect(() => {
    if (userData?.address) {
      const { mobileNumber, pincode, flatHouseNo, streetLocality, landmark, city, state, addressType } = userData.address;
      setMobileNumber(mobileNumber || '');
      setPincode(pincode || '');
      setFlatHouseNo(flatHouseNo || '');
      setStreetLocality(streetLocality || '');
      setLandmark(landmark || '');
      setCity(city || '');
      setState(state || '');
      setAddressType(addressType || 'home');
    }
  }, [userData]);


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccessMessage('');
    setProfileErrorMessage('');

    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateUserData({ displayName });
      setProfileSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setProfileErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressSuccessMessage('');
    setAddressErrorMessage('');

    const addressData = {
        mobileNumber,
        pincode,
        flatHouseNo,
        streetLocality,
        landmark,
        city,
        state,
        addressType
    };

    try {
        await updateUserData({ address: addressData });
        setAddressSuccessMessage('Address saved successfully!');
    } catch (error) {
        setAddressErrorMessage('Failed to save address. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: User Info & Account Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Information</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="ex: Rohit Sharma"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    readOnly
                    placeholder="ex: rohit@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Update Profile
                </button>
                {profileSuccessMessage && <p className="text-green-600 mt-4 text-sm">{profileSuccessMessage}</p>}
                {profileErrorMessage && <p className="text-red-600 mt-4 text-sm">{profileErrorMessage}</p>}
              </form>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Email Verified</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user?.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="text-sm font-medium text-gray-900">{user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Last Sign-in</p>
                  <p className="text-sm font-medium text-gray-900">{user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Delivery Address</h2>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input type="text" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="ex: 9876543210" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input type="text" id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="ex: 560001" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="flatHouseNo" className="block text-sm font-medium text-gray-700">Flat/House No.</label>
                <input type="text" id="flatHouseNo" value={flatHouseNo} onChange={(e) => setFlatHouseNo(e.target.value)} placeholder="ex: D-203, Sunflower Apartments" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="streetLocality" className="block text-sm font-medium text-gray-700">Street/Locality</label>
                <input type="text" id="streetLocality" value={streetLocality} onChange={(e) => setStreetLocality(e.target.value)} placeholder="ex: MG Road, near Trinity Metro Station" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark (Optional)</label>
                <input type="text" id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="ex: Opposite Phoenix Mall" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="ex: Bangalore" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="ex: Karnataka" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Type</label>
                <div className="flex items-center space-x-4 mt-2">
                    <label htmlFor='home' className="flex items-center">
                        <input type="radio" name="addressType" id="home" checked={addressType === 'home'} onChange={() => setAddressType('home')} className="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300"/>
                        <span className="ml-2 text-sm text-gray-700">Home</span>
                    </label>
                    <label htmlFor='work' className="flex items-center">
                        <input type="radio" name="addressType" id="work" checked={addressType === 'work'} onChange={() => setAddressType('work')} className="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300"/>
                        <span className="ml-2 text-sm text-gray-700">Work</span>
                    </label>
                </div>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Save Address
                </button>
                {addressSuccessMessage && <p className="text-green-600 mt-4 text-sm">{addressSuccessMessage}</p>}
                {addressErrorMessage && <p className="text-red-600 mt-4 text-sm">{addressErrorMessage}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
