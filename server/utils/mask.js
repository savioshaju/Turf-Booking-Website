function maskEmail(email) {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!domain) return email;
    return name[0] + "***@" + domain;
}

function maskPhone(phone) {
    if (!phone) return "";
    const s = phone.toString();
    if (s.length < 4) return "***";
    return s.slice(0, 2) + "******" + s.slice(-2);
}

function maskUser(user) {
    if (!user) return user;
    if (user.visibility !== "private") {
        return user._doc ? user._doc : user;
    }

    const u = user.toObject ? user.toObject() : user;


    const masked = {
        _id: u._id,                
        name: u.name,           
        email: u.visibility === "private" ? maskEmail(u.email) : u.email,
        phone: u.visibility === "private" ? maskPhone(u.phone) : u.phone,
        visibility: u.visibility
    };

    return masked;
}

module.exports = { maskEmail, maskPhone, maskUser };
