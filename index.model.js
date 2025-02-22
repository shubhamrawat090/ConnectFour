// index.model.js
class StaticDataModelClass {
  constructor() {
    this.CELL_SIZE = 60;
    this.GAP_SIZE = 10;
    this.CELL_SIZE_MOBILE = 30;
    this.GAP_SIZE_MOBILE = 10;
    this.ROWS = 6;
    this.COLUMNS = 7;
    this.ANIMATION_DURATION = 500;
  }
}

// Export an instance of StaticDataModel as a singleton
export const StaticDataModel = new StaticDataModelClass();
