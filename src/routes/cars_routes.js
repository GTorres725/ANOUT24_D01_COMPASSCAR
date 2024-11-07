const express = require ('express');

const router = express.Router();

const cars_controller = require ('../controllers/cars_controllers');

router.post('/', cars_controller.add_car);
router.get('/', cars_controller.get_allCar);
router.get('/:id', cars_controller.get_car);
router.put('/:id', cars_controller.update_put_car);
router.patch('/:id', cars_controller.update_patch_car);
router.delete('/:id', cars_controller.del_car);


module.exports = router;