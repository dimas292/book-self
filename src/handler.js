const { nanoid } = require('nanoid');
const books = require('./book.js');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {

    if (name === ''){
      const response = h.response({
        status : 'fail',
        message : 'Gagal memperbarui buku. Mohon isi nama buku'
      });

      response.code(400);
      return response;
    };


    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. Mohon isi nama buku',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (_request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(400);
  return response;
};

const updateByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    };

    if (name === ''){
      const response = h.response({
        status : 'fail',
        message : 'Gagal memperbarui buku. Mohon isi nama buku'
      });

      response.code(400);
      return response;
    };

    if (readPage > pageCount){
      const response = h.response({
        status : 'fail',
        message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      });

      response.code(400);
      return response;
    };

    const response = h.response({
      status : 'success',
      message : 'Buku berhasil diperbarui'
    });

    response.code(200);
    return response;

  }

  const response = h.response({
    status : 'fail',
    message : 'Gagal memperbarui buku. Id tidak ditemukan'
  });

  response.code(404);
  return response;

};

const deleteByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index != -1){
    books.splice(index, 1);

    const response = h.response({
      status : 'success',
      message : 'Buku berhasil dihapus'
    });

    response.code(200);
    return response;
  };

  const response = h.response({
    status : 'fail',
    message : 'Buku gagal dihapus. Id tidak ditemukan'
  });

  response.code(404);
  return response;

};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateByIdHandler, deleteByIdHandler };
