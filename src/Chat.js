import "./Chat.css";
import {Button, Container, Form} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import ChatMessage from "./components/ChatMessage";

const ME_AUTHOR = {name: "Já", picture: ""}
const BOT_AUTHOR = {name: "Bot", picture: ""}

const Chat = () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [thinking, setThinking] = useState(false);
    const [history, setHistory] = useState("");

    const messagesWrapperRef = useRef();

    const makeApiRequest = async (question) => {
        const text = (await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: `${history}Q: ${question}\nA:`,
                temperature: 0,
                max_tokens: 30,
                top_p: 1,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                stop: ["\n"]
            })
        }).then(res => res.json())).choices[0].text;
        setHistory(history + `Q: ${question}\nA: ${text}\n`);
        return text;
    };

    useEffect(() => {
        if(currentQuestion == null || currentQuestion.length === 0 || thinking)
            return;

        console.log("Fetching response...")

        setThinking(true);
        makeApiRequest(currentQuestion)
            .then(text => {
                setCurrentQuestion(null);
                setMessages([...messages,
                    {author: BOT_AUTHOR, message: text}
                ]);
                setThinking(false);
            });
    }, [thinking, messages, currentQuestion]);

    useEffect(() => {
        if(messagesWrapperRef.current) {
            messagesWrapperRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if(value == null || value.length === 0)
            return;
        setMessages([...messages,
            {author: ME_AUTHOR, message: value}
        ]);
        setCurrentQuestion(value);
        setValue("");
    };
    return (
        <Container fluid className="d-flex flex-column">
            <div className="messagesWrapper">
                {messages.map((message, index) => {
                    return <ChatMessage messageObj={message} key={index} />
                })}
                {thinking ? <p style={{
                    textAlign: "center"
                }}>{"Bot přemýšlí..."}</p> : null}
                <div ref={messagesWrapperRef} />
            </div>
            <Form onSubmit={handleAddQuestion} style={{
                marginTop: "20px"
            }}>
                <Form.Group className="d-flex flex-row">
                    <Form.Control type="text" placeholder="Zeptej se mě na něco..." onChange={handleChange} value={value || ""} required />
                    <Button type="submit" disabled={currentQuestion != null || thinking}>Odeslat</Button>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default Chat;