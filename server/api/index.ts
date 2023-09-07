import express from "express";

const apiRoutes = express.Router();

apiRoutes.get('/hello', (request, response) => {
  return response.json({
    hello: 'world',
  });
})

export { apiRoutes };