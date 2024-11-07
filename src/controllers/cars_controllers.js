const db = require ('./../database');

exports.add_car = async (req, res)=> {
    const {brand, model, year, plate} = req.body;
    if(!brand) res.status(400).json({ error: 'brand is required' });
    if(!model) res.status(400).json({ error: 'model is required' });
    if(!year) res.status(400).json({ error: 'year is required' });
    if(!plate) res.status(400).json({ error: 'plate is required' });

    let currentYear = new Date().getFullYear();
    if(+year < (currentYear -9) || +year > (currentYear +1)) {
        res.status(400).json({ error: `year must be between ${currentYear -9} and ${currentYear +1}` });
    };
    let created_at = new Date()

    checkPlate = ()=> {
        if(plate.length == 8) {
             const firstThreeChar = plate.slice(0, 3).split('');//AZ
             const fourthChar = plate[3]; //-
             const fifthChar = plate[4]; //09
             const sixthChar = plate[5]; //AJ09
             const lastTwoChar = plate.slice(-2).split(''); //09
             lastTwoChar.push(fifthChar)
     
             try {
                 firstThreeChar.forEach(i => {
                     if (i >= 'A' && i <= 'Z') {
                        i++
                     } else {
                         throw Error
                     }
                 });
             } catch {
                return res.status(400).json({ error: 'plate must be in the correct format ABC-1C34' })
             }
             
             if (fourthChar != '-') {
                return res.status(400).json({ error: 'plate must be in the correct format ABC-1C34' })
             }
     
             if((sixthChar >= '0' && sixthChar <= '9') || (sixthChar >= 'A' && sixthChar <= 'J')) {
             } else {
                return res.status(400).json({ error: 'plate must be in the correct format ABC-1C34' })
             }
     
             try {
                 lastTwoChar.forEach(i => {
                     if(i >= 0 && i <= 9){
                         i++;
                     } else {
                         throw Error;
                     }
                 })
             } catch {
               return res.status(400).json({ error: 'plate must be in the correct format ABC-1C34' });
             }
             
        } else {
            res.status(400).json({ error: 'plate must be in the correct format ABC-1C34' })
        } 
     }
     
     checkPlate();

    try {
        const duplicateCar = await db('cars').where({ plate });
        if(duplicateCar.length > 0) {
            return res.status(409).json({ error: 'car already registered' })
        }
        const [id] = await db('cars').insert({ brand, model, year, plate });
        res.status(201).json({ id, brand, model, year, plate, created_at})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Internal error' })

    }

};

//

exports.get_allCar = async (req, res)=> {
    res.status(200).send('runningCar')
};

exports.get_car = async (req, res)=> {

};

exports.update_put_car = async (req, res)=> {

};

exports.update_patch_car = async (req, res)=> {

};

exports.del_car = async (req, res)=> {

};