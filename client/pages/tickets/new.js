import { useState } from "react"
import Router from 'next/router';
import useRequest from '../../hooks/use-request'
const NewTicket = () => {

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return
        }

        setPrice(value.toFixed(2));
    }

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    })


    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }
    return (<div>
        <h1>Create a Ticket</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" value={title} onChange={e => setTitle(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" step="0.01" value={price} onBlur={onBlur} onChange={e => setPrice(e.target.value)} id="price" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>

    </div>)
}

export default NewTicket