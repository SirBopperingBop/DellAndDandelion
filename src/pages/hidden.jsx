import { Block, Button, List, ListItem, NavLeft, NavTitle, Navbar, Page, TextEditor, f7 } from "framework7-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../components/app";
import { supabase } from "../js/supabaseClient";
import Framework7 from "framework7/types";

export default function Hidden({user}) {
    const [logInfo, setLogInfo] = useContext(Context)
    const prevChatData = useRef()
    console.log(logInfo, user);
    const [chatData, setChatData] = useState()
    const [messageData, setMessageData] = useState({
        username: user.username,
        content: ""
    })

    const handleChange = e => {
        setMessageData(prev => {
            return {
                ...prev,
                content: e
            }
        })
    }
    console.log(messageData);
    const getTableData = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
        prevChatData.current = data;
        if (prevChatData.current !== chatData) {
            setChatData(data)
        }
    }
    useEffect(() => {
        getTableData()
    }, [])

    const handleSendMessage = async () => {
        if (messageData.content !== "") {
            try {
                const { data, error } = await supabase
                    .from("messages")
                    .upsert(messageData)
                console.log(error, data)
                setMessageData({
                    username: user.username,
                    content: ""
                })
                getTableData()
            } catch (error) {
                console.log(error)
            }
        }
        getTableData()
    }

    function createMarkup(htlmString) {
        return { __html: htlmString };
    }

    function stripDiamondSymbol(text) {
        let res = text;
        try {
            const lineSeparatorRegex = /\u2028/g;
            res = text.replace(lineSeparatorRegex, '');
        } catch (error) {
            console.log(error);
        }
        return res;
    }
    
    useEffect(() => {
        document.getElementById('LastMessage').scrollIntoView();

        console.log("scroll");
    }, [chatData, messageData])

    setInterval(getTableData, 200)

    return (
        <Page className="hidden">
            <Navbar className="hidden-nav">
                <NavTitle>Dell and Dandelion</NavTitle>
            </Navbar>
            <Block
                className="chat"
            >
                <List
                    className="chat-list"
                    virtualList
                    virtualListParams={{
                        chatData,
                        height: 70,
                    }}
                >
                        {
                        chatData &&
                        chatData.map((item, index) => (
                            <ListItem
                                key={index}
                                className="message"
                                link="#"
                                // style={{ top: `${vlData.topPosition}px` }}
                                virtualListIndex={chatData.indexOf(item)}
                            ><div>{item.username}</div><div className='form-description' dangerouslySetInnerHTML={createMarkup(stripDiamondSymbol(item.content))} />
                            </ListItem>
                        ))}
                        <a id="LastMessage"></a>
                </List>
            </Block>
            <TextEditor
                className="message-box"
                placeholder={"Type a message"}
                buttons={[
                    ['h1', 'bold', 'italic', 'underline', 'strikeThroughs'],
                ]}
                onTextEditorChange={e => handleChange(e)}
                value={messageData?.content || ""}
            />
            <Button
                className="send"
                fill
                onClick={handleSendMessage}
            >Send</Button>
        </Page>
    )
}