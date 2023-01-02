import './App.css';
import {Container} from "react-bootstrap";
import LayoutHeader from "./components/LayoutHeader";
import Chat from "./Chat";

function App() {
  return (
      <Container className="d-flex flex-column">
          <LayoutHeader />
          <Chat />
      </Container>
  )
}

export default App;
