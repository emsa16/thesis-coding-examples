class Table {
    constructor(rows) {
      this.rowCount = 0;
      // const rows = loadStrings(filename);
      this.data = new Array(rows.length);

      for (let i = 0; i < rows.length; i++) {
        if (trim(rows[i]).length == 0) {
          continue; // skip empty rows
        }
        if (rows[i].startsWith("#")) {
          continue;  // skip comment lines
        }

        // split the row on the tabs
        const pieces = split(rows[i], '\t');
        // copy to the table array
        this.data[this.rowCount] = pieces;
        this.rowCount++;
      }
      // resize the 'data' array as necessary
      this.data = this.data.slice(0, rowCount);
    }


    getRowCount() {
      return this.rowCount;
    }


    // find a row by its name, returns -1 if no row found
    getRowIndex(name) {
      for (let i = 0; i < this.rowCount; i++) {
        if (this.data[i][0] == name) {
          return i;
        }
      }
      console.log("No row named '" + name + "' was found");
      return -1;
    }


    getRowName(row) {
      return this.getString(row, 0);
    }


    getString(row, column) {
      if (isNaN(row)) { //It contains the row name instead of the row index
          row = this.getRowIndex(row);
      }
      return this.data[row][column];
    }


    getInt(row, column) {
      return parseInt(this.getString(row, column));
    }


    getFloat(row, column) {
      return parseFloat(this.getString(row, column));
    }


    setRowName(row, what) {
      this.data[row][0] = what;
    }


    setString(row, column, what) {
      if (NaN(row)) {
          row = this.getRowIndex(row);
      }
      this.data[row][column] = str(what);
    }


    setInt(row, column, what) {
      this.setString(row, column, what);
    }


    setFloat(row, column, what) {
      this.setString(row, column, what);
    }
}