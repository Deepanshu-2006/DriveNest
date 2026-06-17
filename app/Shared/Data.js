import suv from "@/public/suv.png";
import sedan from "@/public/sedan.png";
import hatchback from "@/public/hatchback.png";
import coupe from "@/public/coupe.png"
import hybrid from "@/public/hybrid.png"
import convertible from "@/public/convertible.png"
import van from "@/public/van.png"
import truck from "@/public/truck.png"
import electric from "@/public/electric.png"

const CarMakes = [
    {
        id: 1,
        name: "Audi"
    },

    {
        id: 2,
        name: "BMW"
    },

    {
        id: 3,
        name: "Mercedes"
    }
]

const pricing = [
    {
        id: 1,
        amount: '$1000'
    },

    {
        id: 2,
        amount: '$2000'
    },

    {
        id: 3,
        amount: '$3000'
    },

    {
        id: 4,
        amount: '$10000'
    
    }
]

const Category = [
    {
        id:1,
        name: "SUV",
        icon: suv
    },

    {
        id:2,
        name: "Sedan",
        icon: sedan
    },

    {
        id:3,
        name: "Hatchback",
        icon: hatchback
    },

    {
        id:4,
        name: "Coupe",
        icon: coupe
    },

    {
        id:5,
        name: "Hybrid",
        icon: hybrid
    },

    {
        id:6,
        name: "Convertible",
        icon: convertible
    },

    {
        id:7,
        name: "Van",
        icon: van
    },

    {
        id: 8,
        name: "Truck",
        icon: truck
    },

    {
        id:9,
        name: "Electric",
        icon: electric
    }
]

export default {
    CarMakes,
    pricing,
    Category
}