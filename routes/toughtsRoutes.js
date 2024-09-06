const express = require ('express')
const router = express.Router()

const ToughtController = require ('../controllers/ToughtController')
const checkAuth = require ('../helpers/authHelper')

router.get ('/add', checkAuth, ToughtController.createTought)
router.post ('/add', checkAuth, ToughtController.createToughtSave)
router.get ('/edit/:id', checkAuth, ToughtController.updateTought)
router.post ('/edit', checkAuth, ToughtController.updateToughtSave)
router.get ('/dashboard', checkAuth, ToughtController.showDashboard)
router.post ('/remove', checkAuth, ToughtController.removeTought)
router.get ('/', ToughtController.showToughts)

module.exports = router