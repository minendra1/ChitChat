import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"

const getMessage = () => {
    let dispatch = useDispatch()
    let { selectedUser } = useSelector(state => state.user) 
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
             
                if (!selectedUser) return; 

                let result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, { withCredentials: true })
                dispatch(setMessages(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchMessages()
    }, [selectedUser]) 
}

export default getMessage