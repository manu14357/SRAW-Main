import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import UserAvatar from "./UserAvatar";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai"; // Import an icon for user

const UserEntry = ({ username }) => {
  return (
    // Make the entire entry clickable
    <Link to={`/users/${username}`} style={{ textDecoration: 'none' }}>
      <HorizontalStack 
        justifyContent="flex-start" 
        key={username} 
        sx={{ 
          padding: 0.7, 
          borderRadius: 0.5, 
          transition: 'background-color 0.2s, box-shadow 0.2s', 
          '&:hover': { 
            backgroundColor: '#f5f5f5', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
          },
          border: '1px solid #e0e0e0', // Subtle border
        }}
      >
        {/* User Avatar with hover effect */}
        <UserAvatar 
          width={35} 
          height={35} 
          username={username} 
          sx={{ 
            border: '1px solid #3f51b5', 
            borderRadius: '50%', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', 
            transition: 'transform 0.2s', 
            '&:hover': { transform: 'scale(1.1)' } // Avatar hover effect
          }} 
        />
        <HorizontalStack alignItems="center" sx={{ marginLeft: 1 }}>

          
          {/* Username with improved typography */}
          <Typography 
            sx={{ 
              marginLeft: 0.5, 
              fontWeight: '600', 
              fontSize: '1rem', // Slightly larger font size
              color: '#333', 
              '&:hover': { color: '#3f51b5' } 
            }}
          >
            {username}
          </Typography>
        </HorizontalStack>
      </HorizontalStack>
    </Link>
  );
};

export default UserEntry;
