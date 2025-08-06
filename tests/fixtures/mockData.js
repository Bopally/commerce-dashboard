export const mockProducts = {
  products: [
    {
      id: 1,
      title: "iPhone 12",
      price: 999,
      description: "Apple iPhone 12",
      thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      images: ["https://cdn.dummyjson.com/product-images/1/1.jpg"]
    },
    {
      id: 2,
      title: "Samsung Galaxy",
      price: 899,
      description: "Samsung Galaxy phone",
      thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
      images: ["https://cdn.dummyjson.com/product-images/2/1.jpg"]
    },
    {
      id: 3,
      title: "MacBook Pro",
      price: 1999,
      description: "Apple MacBook Pro",
      thumbnail: "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
      images: ["https://cdn.dummyjson.com/product-images/3/1.jpg"]
    }
  ]
}

export const mockUsers = {
  users: [
    {
      id: 1,
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily.johnson@example.com",
      image: "https://dummyjson.com/icon/emilys/128",
      phone: "+1-555-0123",
      age: 28,
      gender: "female"
    },
    {
      id: 2,
      firstName: "Michael",
      lastName: "Williams",
      email: "michael.williams@example.com",
      image: "https://dummyjson.com/icon/michaelw/128",
      phone: "+1-555-0124",
      age: 35,
      gender: "male"
    },
    {
      id: 3,
      firstName: "Sophia",
      lastName: "Brown",
      email: "sophia.brown@example.com",
      image: "https://dummyjson.com/icon/sophiab/128",
      phone: "+1-555-0125",
      age: 32,
      gender: "female"
    }
  ]
}

export const mockUserCarts = {
  1: {
    carts: [
      {
        id: 1,
        products: [
          {
            id: 1,
            title: "iPhone 12",
            price: 999,
            quantity: 1,
            total: 999,
            thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
          }
        ],
        total: 999,
        discountedTotal: 999,
        userId: 1,
        totalProducts: 1,
        totalQuantity: 1
      }
    ]
  },
  2: {
    carts: [
      {
        id: 2,
        products: [
          {
            id: 2,
            title: "Samsung Galaxy",
            price: 899,
            quantity: 2,
            total: 1798,
            thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg"
          }
        ],
        total: 1798,
        discountedTotal: 1798,
        userId: 2,
        totalProducts: 1,
        totalQuantity: 2
      }
    ]
  },
  3: {
    carts: []
  }
}

export const mockQuotes = {
  quotes: [
    {
      id: 1,
      quote: "Life is what happens when you're busy making other plans.",
      author: "John Lennon"
    }
  ]
}