# React Hooks Dokumentation

## Einführung
React Hooks sind Funktionen, mit denen Sie State und andere React-Funktionen in Funktionskomponenten verwenden können. Sie wurden in React 16.8 eingeführt.

## Grundlegende Hooks

### useState
```jsx
import { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Sie haben {count} Mal geklickt</p>
      <button onClick={() => setCount(count + 1)}>
        Klicken Sie mich
      </button>
    </div>
  );
}
```

### useEffect
```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Code, der nach dem Rendern ausgeführt wird
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // Leeres Array bedeutet, dass dies nur einmal nach dem ersten Rendern ausgeführt wird

  return <div>{data ? data.message : 'Lade...'}</div>;
}
```

### useContext
```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Ich bin ein {theme} Button</button>;
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

## Zusätzliche Hooks

### useReducer
```jsx
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

### useCallback
```jsx
import { useCallback } from 'react';

function MyComponent({ onClick }) {
  const handleClick = useCallback(() => {
    // Ihre Logik hier
    onClick();
  }, [onClick]);

  return <button onClick={handleClick}>Klicken Sie mich</button>;
}
```

### useMemo
```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ a, b }) {
  const result = useMemo(() => {
    return a * b; // Teure Berechnung
  }, [a, b]);

  return <div>Ergebnis: {result}</div>;
}
```

## Benutzerdefinierte Hooks
Sie können auch Ihre eigenen Hooks erstellen:

```jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function MyComponent() {
  const width = useWindowWidth();
  return <div>Fensterbreite: {width}px</div>;
}
```

## Best Practices
- Verwenden Sie Hooks nur auf der obersten Ebene
- Rufen Sie Hooks nur aus React-Funktionskomponenten auf
- Benutzerdefinierte Hooks sollten mit `use` beginnen

## Weitere Ressourcen
- [Offizielle React Hooks Dokumentation](https://reactjs.org/docs/hooks-intro.html)
- [React Hooks API Referenz](https://reactjs.org/docs/hooks-reference.html)

---
_Diese Dokumentation wurde automatisch generiert._
