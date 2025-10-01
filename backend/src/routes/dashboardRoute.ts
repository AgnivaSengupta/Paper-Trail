import express, {Router} from 'express'
import protect from '../middleware/authMiddleware';
import getDashboardSummary from '../controllers/dashboardController'
import type {Request, Response, NextFunction} from 'express'

const router: Router = express.Router();

// adminonly
const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role == 'admin'){
        next();
    } else {
        res.status(403).json({msg: "Admin access only"})
    }
}

router.get('/', protect, adminOnly, getDashboardSummary);

const dashboardRouter = router;
export default dashboardRouter;