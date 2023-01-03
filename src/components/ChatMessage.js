import "./ChatMessage.css";
import "../Chat.css";
import {Col, Row} from "react-bootstrap";

const ChatMessageAuthor = ({author}) => {
    const {name} = author;
    return <Col xs={1} className="d-flex flex-column align-items-center">
        <div className="authorPicture" />
        <p>{name}</p>
    </Col>
}

const ChatMessage = ({messageObj}) => {
    const {author, message} = messageObj;
    return (
        <Row className="chatMessage">
            <ChatMessageAuthor author={author} />
            <Col className="messageTextContainer" style={{
                padding: "5px 20px"
            }}><p>{message}</p></Col>
        </Row>
    );
}

export default ChatMessage;