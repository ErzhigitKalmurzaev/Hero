import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from '../../store/index';
import { fetchFilters, filtersActiveChange, selectAll } from "../heroesFilters/filtersSlice";

import Spinner from "../spinner/Spinner";

const HeroesFilters = () => {

    const {filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const filters = selectAll(store.getState());
    

    useEffect(() => {
        dispatch(fetchFilters())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])    

    const renderFiltersButton = (filters, activeFilter) => {
        
        if (filtersLoadingStatus === "loading") {
            return <Spinner/>;
        } else if (filtersLoadingStatus === "error") {
            return <h5 className="text-center mt-5">Ошибка загрузки</h5>
        }

        if(filters && filters.length > 0){
            return filters.map(({name, label, className}) => {
                if(activeFilter === name){
                    className += " active";
                    return <button 
                        key={name} 
                        className={`btn ${className}`}>{label}
                        </button>
                }
                else{
                    return <button onClick={() => dispatch(filtersActiveChange(name))} key={name} className={`btn ${className}`}>{label}</button>
                }
            })
        }
    }

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderFiltersButton(filters, activeFilter)}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;