# Luxe Ring Builder

Luxe Ring Builder is a responsive jewelry customization web app that lets users design a ring by choosing the metal type, stone option, stone type, ring size, and engraving. It includes a live preview area, a cart section, and a saved designs table so users can manage their custom ring ideas in one place.

## Features

- Custom ring design form.
- Live preview panel that updates based on selections.
- Different preview images for different metal types.
- Cart section for selected ring items.
- Saved designs table for storing ring ideas.
- Delete option for saved items.
- Responsive layout for desktop and mobile screens.
- Elegant jewelry-inspired design.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Node.js
- Express.js
- SQLite

## Project Structure

```bash
jewelry-customizer/
├── images/
│   ├── hero.png
│   ├── ring.png
│   ├── preview-yellow.png
│   ├── preview-white.png
│   ├── preview-rose.png
│   └── preview-silver.png
├── css/
│   └── style.css
├── js/
│   └── script.js
├── index.html
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/lubah-is-hungry/luxe-ring-builder.git
```

### 2. Go to the project folder
```bash
cd luxe-ring-builder
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the server
```bash
node app.js
```

### 5. Open in browser
```bash
http://localhost:3000
```

## How It Works

1. Choose a metal type.
2. Select whether the ring should have a stone.
3. Pick the stone type.
4. Enter ring size.
5. Add engraving text if needed.
6. View the live ring preview.
7. Save the design or add it to the cart.

## Notes

- The hero image stays fixed and does not change.
- The preview image changes based on the selected metal type.
- Make sure all image file names match the names used in the code.
- Cart items are stored in the browser using localStorage.

## Future Improvements

- Add more ring styles and stone options.
- Save cart items in the database.
- Add user login and authentication.
- Add image customization for more realistic previews.
- Improve mobile responsiveness even further.

## Preview

![Home View](images/screenshot-1.png)

![Design Preview](images/screenshot-2.png)

![Cart and Saved Designs](images/screenshot-3.png)

## Author

Developed by **Lubana Bind Abbas**  
GitHub: [lubah-is-hungry](https://github.com/lubah-is-hungry)

## License

This project is for educational and portfolio use.
