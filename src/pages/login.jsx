import React, { useEffect, useState } from 'react';
import { Page, Navbar, Block, Input, ListInput, List, Button } from 'framework7-react';
import { supabase } from '../js/supabaseClient';

const LoginPage = () => {
    const [displayDataArray, setDisplayDataArray] = useState()
    const getTableData = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
        setDisplayDataArray(data)
        console.log(error);
    }
    useEffect(() => {
        getTableData()
    }, [])
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const completeLogin = () => {
        console.log(displayDataArray);
        const user = displayDataArray.filter(user => username == user.username)[0]
        console.log(user);
        if (user.password == password) {
            console.log("success");
        } else {
            console.log("fai, redirect");
        }
    }
    return (
        <Page>
            <Navbar title="Login" backLink="Back" />
            <Block strong inset>
                <List
                    mediaList
                >
                    <ListInput label='Username'
                        onChange={e => setUsername(e.target.value)}
                        ></ListInput>
                    <ListInput label='Password'
                        onChange={e => setPassword(e.target.value)}
                    ></ListInput>
                    <Button
                        onClick={completeLogin}
                        fill
                        bgColor='green'
                    >Submit</Button>
                </List>
            </Block>
        </Page>
    );
}

export default LoginPage;
