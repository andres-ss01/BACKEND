// =============================================================================
// src/seed/data.js - Datos iniciales (6 usuarios y 10 productos)
// -----------------------------------------------------------------------------
// Mantienen la estructura anidada de FakeStoreAPI; los modelos se encargan de
// convertirla a columnas de MySQL al insertar.
// =============================================================================

export const users = [
  {
    "email": "morrison@gmail.com",
    "username": "mor_2314",
    "password": "83r5^_",
    "name": {
      "firstname": "david",
      "lastname": "morrison"
    },
    "phone": "1-570-236-7033",
    "address": {
      "geolocation": {
        "lat": "40.3467",
        "long": "-30.1310"
      },
      "city": "Cullman",
      "street": "Frances Ct",
      "number": 86,
      "zipcode": "29567-1452"
    }
  },
  {
    "email": "john@gmail.com",
    "username": "johnd",
    "password": "m38rmF$",
    "name": {
      "firstname": "john",
      "lastname": "doe"
    },
    "phone": "1-570-236-7033",
    "address": {
      "geolocation": {
        "lat": "-37.3159",
        "long": "81.1496"
      },
      "city": "kilcoole",
      "street": "new road",
      "number": 7682,
      "zipcode": "12926-3874"
    }
  },
  {
    "email": "william@gmail.com",
    "username": "hopkins",
    "password": "William56$hj",
    "name": {
      "firstname": "william",
      "lastname": "hopkins"
    },
    "phone": "1-678-123-4567",
    "address": {
      "geolocation": {
        "lat": "30.2467",
        "long": "-20.5489"
      },
      "city": "san Antonio",
      "street": "Hunters Creek Dr",
      "number": 6454,
      "zipcode": "98234-1734"
    }
  },
  {
    "email": "kevin@gmail.com",
    "username": "kevinryan",
    "password": "kev02937@",
    "name": {
      "firstname": "kevin",
      "lastname": "ryan"
    },
    "phone": "1-567-094-1345",
    "address": {
      "geolocation": {
        "lat": "40.3467",
        "long": "-30.1310"
      },
      "city": "Cullman",
      "street": "Frances Ct",
      "number": 86,
      "zipcode": "29567-1452"
    }
  },
  {
    "email": "derek@gmail.com",
    "username": "derek",
    "password": "jklg*_56",
    "name": {
      "firstname": "derek",
      "lastname": "powell"
    },
    "phone": "1-956-001-1945",
    "address": {
      "geolocation": {
        "lat": "20.1677",
        "long": "-10.6789"
      },
      "city": "san Antonio",
      "street": "adams St",
      "number": 245,
      "zipcode": "80796-1234"
    }
  },
  {
    "email": "maria@gmail.com",
    "username": "maria_g",
    "password": "mar1a#2024",
    "name": {
      "firstname": "maria",
      "lastname": "garcia"
    },
    "phone": "52-442-555-0198",
    "address": {
      "geolocation": {
        "lat": "20.5888",
        "long": "-100.3899"
      },
      "city": "Queretaro",
      "street": "Av. Universidad",
      "number": 120,
      "zipcode": "76000-0001"
    }
  }
];

export const products = [
  {
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "rating": {
      "rate": 3.9,
      "count": 120
    }
  },
  {
    "title": "Mens Casual Premium Slim Fit T-Shirts",
    "price": 22.3,
    "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    "rating": {
      "rate": 4.1,
      "count": 259
    }
  },
  {
    "title": "Mens Cotton Jacket",
    "price": 55.99,
    "description": "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling.",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    "rating": {
      "rate": 4.7,
      "count": 500
    }
  },
  {
    "title": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    "price": 695,
    "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    "rating": {
      "rate": 4.6,
      "count": 400
    }
  },
  {
    "title": "Solid Gold Petite Micropave",
    "price": 168,
    "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.",
    "category": "jewelery",
    "image": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    "rating": {
      "rate": 3.9,
      "count": 70
    }
  },
  {
    "title": "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    "price": 64,
    "description": "USB 3.0 and USB 2.0 compatibility. Fast data transfers, improve PC performance, high capacity; compatibility formatted NTFS for Windows 10.",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    "rating": {
      "rate": 3.3,
      "count": 203
    }
  },
  {
    "title": "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    "price": 109,
    "description": "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    "rating": {
      "rate": 2.9,
      "count": 470
    }
  },
  {
    "title": "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor",
    "price": 999.99,
    "description": "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side. QUANTUM DOT (QLED) TECHNOLOGY, HDR support.",
    "category": "electronics",
    "image": "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    "rating": {
      "rate": 2.2,
      "count": 140
    }
  },
  {
    "title": "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    "price": 56.99,
    "description": "Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    "rating": {
      "rate": 2.6,
      "count": 235
    }
  },
  {
    "title": "Women's Short Sleeve Moisture Wicking Active T-Shirt",
    "price": 12.99,
    "description": "Lightweight perfet for trip or casual wear. Moisture-wicking fabric keeps you dry and comfortable during workouts and daily activities.",
    "category": "women's clothing",
    "image": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    "rating": {
      "rate": 4.5,
      "count": 146
    }
  }
];
