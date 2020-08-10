import React, { ChangeEvent } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import AvatarComponent from "./AvatarComponent";
import { IStoreState } from "../interface/DataInterface";
import { connect } from "react-redux";
import socket from "../socket";
import common from "../common";
import { IPopupUserInfoProps } from "../interface/ComponentInterface";
import { openPopup, closePopup } from "../action/AppActions";
import PopupConfirmComponent from "./PopupConfirmComponent";
import { chooseContentTab, setChatroomNavigation } from "../action/NavigationActions";

let timeOut: NodeJS.Timeout | undefined = undefined;
function PopupUserInfoComponent(
    {
        data,
        friend,
        friendRequest,
        user,
        chatroom,
        form,
        openPopup,
        closePopup,
        chooseContentTab,
        setChatroomNavigation
    }: IPopupUserInfoProps) {
    let { lastName, email, firstName, avatar, _id, nickname, online, lastOnlineTime } = data

    // Get request if i sent
    let requestSent = friendRequest.sent.find(o => o.from._id === user._id && o.to._id === data._id)

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        let sc = socket.getSocket()
        // Clear timeout
        if (timeOut) clearTimeout(timeOut)
        // Set new timeout
        timeOut = setTimeout(() => {
            if (timeOut) clearTimeout(timeOut)
            if (typeof value === 'string' && sc) {
                sc.transmit(common.packet.FRIEND, { evt: common.event.FRIEND.SETNICKNAME, data: { friendId: _id, nickname: value } })
            }
        }, 400)
    }

    const onClickChat = () => {
        // Navigation to conversation content
        chooseContentTab(common.type.EContentTap.CONVERSATION)
        closePopup()
        // Find or create new chatroom
        let chatroomData = chatroom.find(o => {
            return o.chatroom.type === 'conversation' && o.friendsChatroom.length === 1 && o.friendsChatroom[0]._id === _id
        })
        if (chatroomData) setChatroomNavigation(chatroomData.chatroom._id)
        else {
            let sc = socket.getSocket();
            if (sc) sc.transmit(common.packet.CHATROOM,
                {
                    evt: common.event.CHATROOM.CREATE,
                    data: {
                        users: [_id],
                        type: 'conversation',
                    }
                })
        }
    }

    const onSendFriendRequest = () => {
        let sc = socket.getSocket()
        if (!sc) return;
        sc.transmit(common.packet.FRIEND, { evt: common.event.FRIEND.SENDFRIENDREQUEST, data: { userId: _id } })
    }

    const onCancelFriendRequest = () => {
        let sc = socket.getSocket()
        if (!sc || !requestSent) return;
        sc.transmit(common.packet.FRIEND, { evt: common.event.FRIEND.CANCELFRIENDREQUEST, data: { requestId: requestSent._id } })
    }

    const onRemoveFriend = () => {
        openPopup({
            body: <PopupConfirmComponent
                content={`Are you sure you want to remove ${lastName} ${firstName} from your friends list?`}
                buttons={[{
                    title: "Ok",
                    primary: true,
                    func: () => {
                        let sc = socket.getSocket()
                        if (!sc) return;
                        sc.transmit(common.packet.FRIEND, { evt: common.event.FRIEND.REMOVE, data: { friendId: _id } })
                    }
                }, { title: "Cancel" }]}
            />
        })
    }

    return (
        <div className="popup_user_info">
            <AvatarComponent url={avatar} size="langer" className="mb-2" online={{ status: online, lastOnlineTime }} />
            <div className="text-normal text-13">{email}</div>
            <div className="d-flex align-items-center flex-column mb-4">
                <div className="text-normal text-30">{`${lastName} ${firstName}`}</div>
                <div className={`nickname align-items-center ${form !== "friend" || friend.every(o => o._id !== _id) ? 'd-none' : 'd-flex'}`}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Nickname"
                            defaultValue={nickname}
                            aria-label="Nickname"
                            aria-describedby="basic-addon1"
                            onChange={onInputChange}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text id="basic-addon1">
                                <i className="fa fa-pencil" />
                            </InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
            </div>
            <div className="control-area">
                {
                    friend.every(o => o._id !== _id) ?
                        <>:</>
                        :
                        <Button
                            variant="outline-primary"
                            onClick={onClickChat}
                        >
                            <i className="fa fa-comment" />
                        </Button>
                }
                {
                    friend.every(o => o._id !== _id) ?
                        <Button variant={requestSent ? "outline-danger" : "outline-primary"} onClick={requestSent ? onCancelFriendRequest : onSendFriendRequest}>
                            {
                                requestSent ?
                                    <i className="fa fa-user-times" />
                                    :
                                    <i className="fa fa-user-plus" />
                            }
                        </Button>
                        :
                        <Button variant="outline-danger" onClick={onRemoveFriend}>
                            <i className="fa fa-trash" />
                        </Button>
                }
            </div>
        </div>
    )
}

export default connect(
    ({ friend, friendRequest, user, chatroom }: IStoreState) => ({
        user,
        friend,
        friendRequest,
        chatroom
    }),
    {
        openPopup,
        closePopup,
        chooseContentTab,
        setChatroomNavigation
    }
)(PopupUserInfoComponent)