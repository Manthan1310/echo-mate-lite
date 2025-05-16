import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from '../hooks/useGetProfile';
import axios from "axios";
import { USER_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

const Profile = () => {
    const { user, profile } = useSelector(store => store.user);
    const { id } = useParams();
    useGetProfile(id);
    const dispatch = useDispatch();

    const [editMode, setEditMode] = useState(false); // Manage edit mode
    const [updatedBio, setUpdatedBio] = useState(profile?.bio || ""); // Manage bio changes
    const [selectedFile, setSelectedFile] = useState(null); // Manage profile picture

    const followAndUnfollowHandler = async () => {
        if (user.following.includes(id)) {
            // Unfollow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.error(error);
            }
        } else {
            // Follow
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
                dispatch(followingUpdate(id));
                dispatch(getRefresh());
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                console.error(error);
            }
        }
    };

    const handleSaveProfile = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${USER_API_END_POINT}/profile/${user?._id}`, { bio: updatedBio });
            toast.success(res.data.message);
            setEditMode(false); // Exit edit mode after saving
            dispatch(getRefresh()); // Refresh profile info
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadPicture = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`${USER_API_END_POINT}/profile/${user?._id}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(res.data.message);
            dispatch(getRefresh()); // Refresh profile info
        } catch (error) {
            toast.error("Failed to upload profile picture.");
            console.error(error);
        }
    };

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            <div>
                <div className='flex items-center py-2'>
                    <Link to="/" className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size="24px" />
                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profile?.name}</h1>
                        <p className='text-gray-500 text-sm'>10 posts</p>
                    </div>
                </div>
                <img src="/Banner.png" alt="banner" />
                <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
                    <Avatar src={profile?.profilePicture || "https://pbs.twimg.com/profile_images/1703261403237502976/W0SFbJVS_400x400.jpg"} size="120" round={true} />
                </div>
                <div className='text-right m-4'>
                    {profile?._id === user?._id ? (
                        editMode ? (
                            <>
                                <button
                                    onClick={handleSaveProfile}
                                    className='px-4 py-1 bg-black text-white rounded-full'>
                                    Save
                                </button>
                                <div className='mt-2'>
                                    <input type="file" onChange={handleFileChange} />
                                    <button
                                        onClick={handleUploadPicture}
                                        className='px-4 py-1 bg-black text-white rounded-full mt-2'>
                                        Upload Picture
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className='px-4 py-1 hover:bg-gray-200 rounded-full border border-gray-400'>
                                Edit Profile
                            </button>
                        )
                    ) : (
                        <button onClick={followAndUnfollowHandler} className='px-4 py-1 bg-black text-white rounded-full'>
                            {user.following.includes(id) ? "Following" : "Follow"}
                        </button>
                    )}
                </div>
                <div className='m-4'>
                    <h1 className='font-bold text-xl'>{profile?.name}</h1>
                    <p>{`@${profile?.username}`}</p>
                </div>
                <div className='m-4 text-sm'>
                    {editMode ? (
                        <textarea
                            value={updatedBio}
                            onChange={(e) => setUpdatedBio(e.target.value)}
                            className='w-full border rounded p-2'
                        />
                    ) : (
                        <p>{profile?.bio}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;