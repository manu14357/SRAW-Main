// emailContentGenerator.js
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const { formatDistanceToNow } = require('date-fns');

// Read the HTML template
const templatePath = path.join(__dirname, 'emailTemplate.html');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const template = handlebars.compile(templateSource);

// Register custom Handlebars helper
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

const generateEmailContent = (username, unreadCount, notifications) => {
    const timeAgo = notification => {
        const distance = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
        return distance;
    };

    // Prepare data for the template
    const data = {
        username,
        unreadCount,
        notifications: notifications.map(notification => ({
            sender: notification.sender.username,
            type: notification.type,
            timeAgo: timeAgo(notification)
        }))
    };

    return template(data);
};

module.exports = generateEmailContent;
