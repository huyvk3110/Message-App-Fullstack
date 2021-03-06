import React from "react";
import { View } from "react-native";
import style from "../style";
import MessageHeader from "../component/component.message.header";
import MessageControl from "../component/component.message.control";
import MessageContent from "../component/component.message.content";
import { IComponentProps } from "../interface/interface.component";

const MessageContainer = ({ navigation, route }: IComponentProps) => {
    let { chatroomId } = route?.params;

    return (
        <View style={style.message.message.wrap}>
            <MessageHeader navigation={navigation} chatroomId={chatroomId} />
            <MessageContent chatroomId={chatroomId} />
            <MessageControl chatroomId={chatroomId} />
        </View>
    )
}

export default MessageContainer;