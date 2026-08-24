function getStaticFallback(message, profile) {
    const query = message.toLowerCase();
    const contact = profile.contact;

    if (/\b(contact|email|reach|linkedin|github)\b/.test(query)) {
        return `You can contact Yashraj at ${contact.email}. You can also visit his GitHub profile (${contact.github}) or LinkedIn profile (${contact.linkedin}).`;
    }

    if (/\b(skill|technology|tech stack|know|learned)\b/.test(query)) {
        return `Yashraj works with ${profile.skills.join(', ')}. His main interests are ${profile.interests.join(', ')}.`;
    }

    if (/\b(education|study|college|degree|year|student)\b/.test(query)) {
        return `${profile.identity.name} is a ${profile.education[0].status} ${profile.education[0].degree} student from ${profile.identity.location}.`;
    }

    if (/\b(intern|collab|available|hire|hiring)\b/.test(query)) {
        return profile.availability.approvedWording + ` Please email him at ${contact.email} to start a conversation.`;
    }

    const project = profile.projects.find(item => query.includes(item.name.toLowerCase().split(' – ')[0]));
    if (project) {
        const demo = project.liveDemo ? ` Live demo: ${project.liveDemo}` : '';
        return `${project.name}: ${project.summary} Technologies: ${project.technologies.join(', ')}.${demo}`;
    }

    if (/\b(project|portfolio|built|build)\b/.test(query)) {
        return `Yashraj has built projects including ${profile.projects.slice(0, 5).map(item => item.name).join(', ')}, and more. Ask me about a specific project for details.`;
    }

    return `I can help with Yashraj's profile, skills, education, projects, internships, collaborations, and contact details. For anything outside the portfolio, please use ${contact.email}.`;
}

module.exports = { getStaticFallback };
