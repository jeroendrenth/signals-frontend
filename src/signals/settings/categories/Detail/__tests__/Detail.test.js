import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { withAppContext } from 'test/utils';
import routes from 'signals/settings/routes';
import categoryJSON from 'utils/__tests__/fixtures/category.json';
import configuration from 'shared/services/configuration/configuration';
import { fetchCategories } from 'models/categories/actions';
import { showGlobalNotification } from 'containers/App/actions';

import useConfirmedCancel from '../../../hooks/useConfirmedCancel';
import CategoryDetailContainer from '..';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
}));

jest.mock('models/categories/actions', () => ({
  __esModule: true,
  ...jest.requireActual('models/categories/actions'),
}));

jest.mock('../../../hooks/useConfirmedCancel');

const userCan = jest.fn(() => true);
jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => userCan);

const dispatch = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);

const push = jest.fn();
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}));

const confirmedCancel = jest.fn();
useConfirmedCancel.mockImplementation(() => confirmedCancel);

describe('signals/settings/categories/Detail', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify(categoryJSON));

    dispatch.mockReset();
    push.mockReset();
    confirmedCancel.mockReset();
  });

  it('should render a backlink', async () => {
    const { container } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => container.querySelector('a'));

    expect(container.querySelector('a').getAttribute('href')).toEqual(
      routes.categories
    );
  });

  it('should render a backlink with the proper referrer', async () => {
    const referrer = '/some-page-we-came-from';

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }));

    const { container } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => container.querySelector('a'));

    expect(container.querySelector('a').getAttribute('href')).toEqual(referrer);
  });

  it('should render the correct page title for a new category', async () => {
    const { getByText } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByText('Categorie toevoegen'));
    expect(getByText('Categorie toevoegen')).toBeInTheDocument();
  });

  it('should render the correct page title for an existing category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: categoryJSON.id,
    }));

    const { getByText } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByText('Categorie wijzigen'));
    expect(getByText('Categorie wijzigen')).toBeInTheDocument();
  });

  it('should render a form for a new category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: undefined,
    }));

    const { getByTestId } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    document
      .querySelectorAll('input[type="text"], textarea')
      .forEach(element => {
        expect(element.value).toEqual('');
      });
  });

  it('should render a form for an existing category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 123,
    }));

    const { getByTestId } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    expect(document.querySelector('#name').value).toEqual(categoryJSON.name);
    expect(document.querySelector('#description').value).toEqual(
      categoryJSON.description
    );
  });

  it('should call confirmedCancel', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 456,
    }));

    const { container, getByTestId } = render(
      withAppContext(<CategoryDetailContainer />)
    );

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    const nameField = container.querySelector('#name');
    const cancelButton = getByTestId('cancelBtn');

    act(() => {
      // no changes to data in form fields
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(1);
    expect(confirmedCancel).toHaveBeenCalledWith(true);

    act(() => {
      // changes made, but data remains the same
      fireEvent.change(nameField, { target: { value: categoryJSON.name } });
    });

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(2);
    expect(confirmedCancel).toHaveBeenLastCalledWith(true);

    act(() => {
      // changes made, data differs from initial API data
      fireEvent.change(nameField, { target: { value: 'Some other value' } });
    });

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(3);
    expect(confirmedCancel).toHaveBeenLastCalledWith(false);
  });

  it('should call confirmedCancel when data has NULL values', async () => {
    const dataWithNullValue = { ...categoryJSON, description: null };
    fetch.mockResponse(JSON.stringify(dataWithNullValue));

    const { container, getByTestId } = render(
      withAppContext(<CategoryDetailContainer />)
    );

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    const descriptionField = container.querySelector('#description');
    const cancelButton = getByTestId('cancelBtn');

    act(() => {
      // no changes to data in form fields
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(1);
    expect(confirmedCancel).toHaveBeenCalledWith(true);

    act(() => {
      // changes made, but data remains the same
      fireEvent.change(descriptionField, { target: { value: '' } });
    });

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(2);
    expect(confirmedCancel).toHaveBeenLastCalledWith(true);

    act(() => {
      // changes made, data differs from initial API data
      fireEvent.change(descriptionField, { target: { value: 'Here be a description' } });
    });

    act(() => {
      fireEvent.click(cancelButton);
    });

    expect(confirmedCancel).toHaveBeenCalledTimes(3);
    expect(confirmedCancel).toHaveBeenLastCalledWith(false);
  });

  it('should call patch on submit', async () => {
    const categoryId = 789;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }));

    const { getByTestId } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(1);

    const submitBtn = getByTestId('submitBtn');

    act(() => {
      fireEvent.click(submitBtn);
    });

    expect(dispatch).not.toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenLastCalledWith(
      `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`,
      expect.objectContaining({ method: 'PATCH' })
    );

    // on patch success, re-request all categories
    await wait(() => getByTestId('detailCategoryForm'));

    expect(dispatch).toHaveBeenCalledWith(fetchCategories());
  });

  it('should redirect on patch success', async () => {
    const categoryId = 789;
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }));

    const { getByTestId } = render(withAppContext(<CategoryDetailContainer />));

    await wait(() => getByTestId('detailCategoryForm'));
    expect(getByTestId('detailCategoryForm')).toBeInTheDocument();

    const submitBtn = getByTestId('submitBtn');

    act(() => {
      fireEvent.click(submitBtn);
    });

    expect(dispatch).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();

    await wait(() => getByTestId('detailCategoryForm'));

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(expect.any(Object))
    );

    expect(push).toHaveBeenCalledTimes(1);
  });
});
