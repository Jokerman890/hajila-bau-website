# React Components Dokumentation

## Einführung
React-Komponenten sind die Bausteine von React-Anwendungen. Sie ermöglichen die Aufteilung der Benutzeroberfläche in unabhängige, wiederverwendbare Teile.

## Komponenten-Typen

### Funktionale Komponenten
```jsx
function Welcome(props) {
  return <h1>Hallo, {props.name}</h1>;
}

// Verwendung
<Welcome name="Sarah" />
```

### Klassenkomponenten
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hallo, {this.props.name}</h1>;
  }
}

// Verwendung
<Welcome name="Sarah" />
```

## Props (Eigenschaften)

### Grundlegende Verwendung
```jsx
function Welcome(props) {
  return <h1>Hallo, {props.name}</h1>;
}

// Verwendung mit mehreren Props
<Welcome name="Max" age={30} />
```

### Props mit Destrukturierung
```jsx
function Welcome({ name, age }) {
  return <h1>Hallo {name}, du bist {age} Jahre alt</h1>;
}
```

### Standard-Props
```jsx
function Welcome({ name = 'Gast' }) {
  return <h1>Hallo, {name}</h1>;
}

// Oder mit defaultProps
Welcome.defaultProps = {
  name: 'Gast'
};
```

## State Management

### State in Klassenkomponenten
```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Anzahl: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Erhöhen
        </button>
      </div>
    );
  }
}
```

### State in Funktionskomponenten (mit Hooks)
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Anzahl: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Erhöhen
      </button>
    </div>
  );
}
```

## Lebenszyklus-Methoden (Klassenkomponenten)

### Häufig verwendete Methoden
```jsx
class Example extends React.Component {
  componentDidMount() {
    // Wird nach dem ersten Rendern aufgerufen
    console.log('Komponente wurde eingebunden');
  }

  componentDidUpdate(prevProps, prevState) {
    // Wird nach jedem Update aufgerufen
    console.log('Komponente wurde aktualisiert');
  }

  componentWillUnmount() {
    // Wird vor dem Entfernen der Komponente aufgerufen
    console.log('Komponente wird entfernt');
  }

  render() {
    return <div>Beispielkomponente</div>;
  }
}
```

## Event-Handling

### Einfacher Event-Handler
```jsx
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('Der Link wurde geklickt.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Klick mich
    </a>
  );
}
```

### Event-Handler mit Parametern
```jsx
function DeleteButton({ id, onDelete }) {
  return (
    <button onClick={() => onDelete(id)}>
      Löschen
    </button>
  );
}
```

## Bedingtes Rendern

### If-Else in JSX
```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```

### Logischer UND-Operator (&&)
```jsx
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hallo!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          Sie haben {unreadMessages.length} ungelesene Nachrichten.
        </h2>
      }
    </div>
  );
}
```

## Listen und Keys

### Listen rendern
```jsx
function NumberList({ numbers }) {
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return <ul>{listItems}</ul>;
}

// Verwendung
const numbers = [1, 2, 3, 4, 5];
<NumberList numbers={numbers} />
```

## Formulare

### Kontrollierte Komponenten
```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleSubmit = (event) => {
    alert('Ein Name wurde übergeben: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Absenden" />
      </form>
    );
  }
}
```

## Komposition vs. Vererbung

### Children-Prop
```jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Willkommen
      </h1>
      <p className="Dialog-message">
        Vielen Dank für Ihren Besuch!
      </p>
    </FancyBorder>
  );
}
```

## Best Practices

### Prop-Typen
```jsx
import PropTypes from 'prop-types';

function Greeting({ name, age }) {
  return <h1>Hallo {name}, du bist {age} Jahre alt</h1>;
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
};

Greeting.defaultProps = {
  age: 18
};
```

### Memo für Leistungsoptimierung
```jsx
import { memo } from 'react';

const MyComponent = memo(function MyComponent(props) {
  /* Rendern mit Props */
});
```

## Weitere Ressourcen
- [Offizielle React Dokumentation](https://reactjs.org/docs/components-and-props.html)
- [React Komponenten-API Referenz](https://reactjs.org/docs/react-component.html)

---
_Diese Dokumentation wurde automatisch generiert._
