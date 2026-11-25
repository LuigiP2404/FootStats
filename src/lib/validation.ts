const isPositiveInteger = (id: number): boolean => {
    return (Number.isInteger(id) && id > 0)
}

export { isPositiveInteger  }