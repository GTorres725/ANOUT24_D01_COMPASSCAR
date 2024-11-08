const db = require ('./../database');

exports.add_car = async (req, res)=> {
    const {brand, model, year, plate} = req.body;
    if(!brand) res.status(400).json({ 'errors': ["brand is required"] });
    if(!model) res.status(400).json({ 'errors': ["model is required"] });
    if(!year) res.status(400).json({ 'errors': ["year is required"] });
    if(!plate) res.status(400).json({ 'errors': ["plate is required"] });

    yearVerification = ()=> {
        let currentYear = new Date().getFullYear();
        if(isNaN(+year)) return res.status(400).json({ 'errors': [`year must be between ${currentYear -9} and ${currentYear +1}`] })
        if(+year < (currentYear -9) || +year > (currentYear +1)) {
            return res.status(400).json({ 'errors': [`year must be between ${currentYear -9} and ${currentYear +1}`] });
        };
    }

    yearVerification();

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
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
             }
             
             if (fourthChar != '-') {
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
             }
     
             if((sixthChar >= '0' && sixthChar <= '9') || (sixthChar >= 'A' && sixthChar <= 'J')) {
             } else {
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
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
               return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] });
             }
             
        } else {
            res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
        } 
     }
     
     checkPlate();

    try {
        const duplicateCar = await db('cars').where({ plate });
        if(duplicateCar.length > 0) {
            return res.status(409).json({ 'errors': ["car already registered"] })
        }
        const [id] = await db('cars').insert({ brand, model, year, plate });
        res.status(201).json({ id, brand, model, year, plate, created_at})
    } catch (error) {
        res.status(500).json({ 'errors': ["an internal server error ocurred"] })
    }
};

//

exports.get_allCar = async (req, res)=> {
    const { year, final_plate, brand, page, limit} = req.params;

        let getCars = db('cars');

        if(year) getCars = getCars.where('year', '>=', year);
        
        if(final_plate) getCars = getCars.where('plate', 'LIKE', `%${final_plate}`);

        if(brand) getCars = getCars.where('brand', 'LIKE', `%${brand}%`);


};

//

exports.get_car = async (req, res)=> {
    const { id } = req.params;

    const carVerification = await db('cars').where('id', '=', id);
    if(carVerification.length == 0) return res.status(404).json({ 'errors': ["car not found"] });

    const car = await db('cars').select('*').where('id', '=', id);
    const car_items = await db('cars_items').select('name').where('car_id', '=', id);
    const itemsName = car_items.map((i) => {
        return i.name;
    })
    
    car[0].items = itemsName; //Quebrei a cabeça aqui com a lógica do knex de sempre vir um array kkk Talvez tenha sido apenas a mente cansada. Comentário apenas para me lebrar desse dia quando eu verificar novamente esse código.

    res.send(car[0]);
};
 
//

exports.update_put_car = async (req, res)=> {
    const { id } = req.params;
    const items = req.body;

    const idCar = await db('cars').where('id', '=', id)
    if(idCar.length == 0) return res.status(404).json({ 'errors': ["car not found"] });

    if(items.length == 0) return res.status(400).json({ 'errors': ["items is required"] });

    if(items.length > 5) return res.status(400).json({ 'errors': ["items must be a maximum of 5"] });

    const duplicateItems = new Set()
    items.forEach(i => {
        duplicateItems.add(i)
    });
    if(items.length != duplicateItems.size) return res.status(400).json({ 'errors': ["items cannot be repeat"] });

    const formatedItems = items.map((i) => {
        return {name: i, car_id: id}
    });
    
    try {
        await db('cars_items').insert(formatedItems);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ 'errors': ["an internal server error ocurred"] });
    }
};

//

exports.update_patch_car = async (req, res)=> {
    const { id } = req.params;
    let { brand, model, year, plate } = req.body;

    const idCar = await db('cars').where('id', '=', id)
    if(idCar.length == 0) return res.status(404).json({ 'errors': ["car not found"] });

    if(brand == '') brand = undefined;
    if(year == '') year = undefined;
    if(plate == '') plate = undefined;

    if(plate) {
        const duplicateCar = await db('cars').where({ plate });
        if(duplicateCar.length > 0) return res.status(409).json({ 'errors': ["car already registered"] });
    }

    if(brand && !model) return res.status(400).json({ 'errors': ["model must also be informed"] })

    yearVerification = ()=> {
        let currentYear = new Date().getFullYear();
        if(isNaN(+year)) return res.status(400).json({ 'errors': [`year must be between ${currentYear -9} and ${currentYear +1}`] })
        if(+year < (currentYear -9) || +year > (currentYear +1)) {
            return res.status(400).json({ 'errors': [`year must be between ${currentYear -9} and ${currentYear +1}`] });
        };
    }
    if(year != undefined) yearVerification();

    checkPlate = ()=> {
        if(plate.length == 8) {
             const firstThreeChar = plate.slice(0, 3).split('');//AZ
             const fourthChar = plate[3]; //-
             const fifthChar = plate[4]; //09
             const sixthChar = plate[5]; //AJ09
             const lastTwoChar = plate.slice(-2).split(''); //09
             lastTwoChar.push(fifthChar);
     
             try {
                 firstThreeChar.forEach(i => {
                     if (i >= 'A' && i <= 'Z') {
                        i++
                     } else {
                         throw Error
                     }
                 });
             } catch {
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
             }
             
             if (fourthChar != '-') {
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
             }
     
             if((sixthChar >= '0' && sixthChar <= '9') || (sixthChar >= 'A' && sixthChar <= 'J')) {
             } else {
                return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
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
               return res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] });
             }
             
        } else {
            res.status(400).json({ 'errors': ["plate must be in the correct format ABC-1C34"] })
        } 
     }
     if(plate != undefined) checkPlate();

     try {
        await db('cars').update({ brand, model, year, plate }).where({ id });
        res.status(204).send()
     } catch (error) {
        res.status(500).json({ 'errors': ["an internal server error ocurred"] })
     }
};

//

exports.del_car = async (req, res)=> {
    const { id } = req.params;

    const carVerification = await db('cars').where('id', '=', id);
    if(carVerification.length == 0) return res.status(404).json({ 'errors': ["car not found"] });

    try {
        await db('cars').where({ id }).del();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ 'errors': ["an internal server error ocurred"] });
    }
};