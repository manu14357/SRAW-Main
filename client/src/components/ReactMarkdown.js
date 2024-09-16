import React from 'react';
import ReactMarkdown from 'react-markdown'; // Use 'react-markdown' npm package

const markdownContent = `
# Welcome to SRAWS!
This platform allows you to post and comment on various topics.  
Here are some things you can do:
- Post content
- Comment on posts
- Report scams and alerts
`;

const App = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>SRAWS - Scam Reporting & Alert Platform</h1>
      <ReactMarkdown 
        children={markdownContent} 
        components={{
          h1: ({node, ...props}) => <h1 style={{color: '#e74c3c', fontSize: '2.2rem'}} {...props} />,
          p: ({node, ...props}) => <p style={{fontSize: '1rem', lineHeight: '1.6'}} {...props} />,
          ul: ({node, ...props}) => <ul style={{paddingLeft: '1.5rem', color: '#3498db'}} {...props} />,
          li: ({node, ...props}) => <li style={{fontSize: '1rem'}} {...props} />
        }}
      />
    </div>
  );
};

export default App;
