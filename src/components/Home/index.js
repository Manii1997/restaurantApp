import {useState, useEffect, useContext} from 'react'
import Header from '../Header'
import DishItem from '../DishItem'
import CartContext from '../../context/CartContext'
import './index.css'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [response, setResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const {cartList, setRestaurantName} = useContext(CartContext)

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachItem => ({
      menuCategory: eachItem.menu_category,
      menuCategoryId: eachItem.menu_category_id,
      restaurantName: eachItem.restaurant_name,
      menuCategoryImage: eachItem.menu_category_image,
      categoryDishes: eachItem.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  const fetchRestaurantApi = async () => {
    const api = 'https://run.mocky.io/v3/72562bef-1d10-4cf5-bd26-8b0c53460a8e'
    const apiResponse = await fetch(api)
    const data = await apiResponse.json()
    const updatedData = getUpdatedData(data[0].table_menu_list)
    setResponse(updatedData)
    setRestaurantName(data[0].restaurant_name)
    setActiveCategoryId(updatedData[0].menuCategoryId)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchRestaurantApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUpdateActiveCategoryId = menuCategoryId =>
    setActiveCategoryId(menuCategoryId)

  const addItemToCart = () => {}
  const removeItemFromCart = () => {}

  const renderTabMenuList = () =>
    response.map(eachCategory => {
      const onClickHandler = () =>
        onUpdateActiveCategoryId(eachCategory.menuCategoryId)

      return (
        <li
          className={`each-tab-item ${
            eachCategory.menuCategoryId === activeCategoryId
              ? 'active-tab-item'
              : ''
          }`}
          key={eachCategory.menuCategoryId}
          onClick={onClickHandler}
        >
          <button type="button" className="tab-btn">
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })

  const renderDishes = () => {
    const category = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    if (!category) {
      return <p>No dishes available for the selected category.</p>
    }

    return (
      <ul className="dishes-item-container">
        {category.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  return isLoading ? (
    renderSpinner()
  ) : (
    <div className="resto-app-container">
      <Header cartItems={cartList} />
      <div className="dishes-container">
        <ul className="tab-menu-list">{renderTabMenuList()}</ul>
        {renderDishes()}
      </div>
    </div>
  )
}

export default Home
