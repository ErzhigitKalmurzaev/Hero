import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { heroCreated } from "../heroesList/heroesSlice";
import { selectAll } from '../heroesFilters/filtersSlice';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store/index';

const HeroesAddForm = () => {

    const [heroDescription, setHeroDescription] = useState('');
    const [heroName, setHeroName] = useState('');
    const [heroElement, setHeroElement] = useState('')

    const { heroesLoadingStatus} = useSelector(state => state.filters)
    const dispatch = useDispatch();
    const {request} = useHttp();
    const filters = selectAll(store.getState())

    const onAddHero = (e) => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement
        }
        
        request(`http://localhost:3001/heroes`, "POST", JSON.stringify(newHero))
        .then(dispatch(heroCreated(newHero)))
        .catch(err => console.log(err))

        setHeroName('');
        setHeroDescription('');
        setHeroElement('');
    }

    const renderFilters = (filters, status) => {
        
        if(status === 'loading'){
            return  <option value="fire">Элементы загружаются</option>
        }
        else if(status === 'error'){
            return <option value="fire">Произошла ошибка</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onAddHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name"
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    value={heroDescription}
                    onChange={(e) => {setHeroDescription(e.target.value)}}
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    value={heroElement}
                    onChange={(e) => {setHeroElement(e.target.value)}}
                    name="element">
                    <option >Я владею элементом...</option>
                    {renderFilters(filters, heroesLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;