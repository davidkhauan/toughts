function checkAuth (requisition, response, next) {
    const UserId = requisition.session.UserId

    if (!UserId) {
        response.redirect ('/login')
        return
    }

    next()
}

module.exports = checkAuth