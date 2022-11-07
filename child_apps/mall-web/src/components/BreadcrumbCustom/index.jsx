import React from 'react'
import { Link } from 'umi'
import { Breadcrumb } from 'antd'

const getRoutes = (allRoutes, curPath) => {
  let routes = []
  function find(arr, parentRoute) {
    let route = arr.find((r) => r.path == curPath)
    if (route) {
      routes = [...routes, parentRoute, route]
    } else {
      arr.forEach((r) => {
        if (r.routes) {
          find(r.routes, r)
        }
      })
    }
  }
  find(allRoutes, null)

  routes.forEach((r) => {
    if (r && r.children) {
      delete r.children
    }
  })

  return routes.filter((r) => r)
}

const Index = (props) => {
  const allRoutes = props.route.routes
  const curPath = props.location.pathname
  const routes = getRoutes(allRoutes, curPath)
  const itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1
    return last ? <span>{route.name}</span> : <span>{route.name}</span>
  }
  return <Breadcrumb itemRender={itemRender} routes={routes} />
}

export default Index
