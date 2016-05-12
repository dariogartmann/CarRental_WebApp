# CarRental_WebApp
CarRental web application using the MEAN stack. 

This project was made for M426 @ GBS SG 

## How it works
To start cd to root and run
'npm start'


### using README.md as clipboard


,controller: 'CarController',
        resolve: {
            postPromise: ['cars', function(cars){
                return cars.getAll();
            }]
        }