class APIFeatures {
  constructor(model, query) {
    this.model = model;
    this.query = query;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];

    excludedFields.forEach((el) => delete queryObj[el]);

    this.model = this.model.find(queryObj);
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortedAt = this.query.sort.split(',').join(' ');
      this.model = this.model.sort(sortedAt);
    } else {
      this.model = this.model.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const limit = this.query.limit || 10;
    const page = this.query.page || 1;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
