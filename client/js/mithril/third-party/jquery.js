/* global $, window, document, editor, socket, textarea, localStorage, moment, Notification */
'use strict';


$(function() {

  var Notify = window.Notify.default;

  if(Notification.permission == 'granted') {
    onPermissionGranted();
  } else if(Notification.permission == 'denied') {
    onPermissionDenied();
  }

  function onPermissionGranted() {
    $('#notification').html(
      '<span class="text-success"><i class="fa fa-bell-o"></i>Notifications activées</span>'
    );
  }

  function onPermissionDenied() {
    $('#notification').html(
      '<span class="text-danger"><i class="fa fa-bell-slash-o"></i>Notifications bloquées</span>'
    );
  }

  $('#afk').click(function(e) {
    textarea.value = '/afk on|off';
    textarea.focus();
    e.preventDefault();
  });

  $('#pm').click(function(e) {
    textarea.value = '/msg @';
    textarea.focus();
    e.preventDefault();
  });

  $('#poke').click(function(e) {
    textarea.value = '/poke @';
    textarea.focus();
    e.preventDefault();
  });

  $('#roll').click(function(e) {
    textarea.value = '/roll 1d6';
    textarea.focus();
    e.preventDefault();
  });

  $('#rolluser').click(function(e) {
    textarea.value = '/roll @';
    textarea.focus();
    e.preventDefault();
  });

  $('#requestpermission').click(function(e) {
    if(Notify.isSupported()) {
      Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }
    e.preventDefault();
  });

  $('#unlock').click(function(e) {
    textarea.value = '/unlock @';
    textarea.focus();
    e.preventDefault();
  });

  $('#banLink').click(function(e) {
    $('#banPopup').modal();
    e.preventDefault();
  });

  $('#banList').click(function(e) {
    socket.emit('banlist');
    e.preventDefault();
  });

  $('button[role="ban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('ban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $('button[role="unban"]').click(function(e) {
    var username = $('input[name="userBanned"]').val();
    socket.emit('unban', username);
    $('#banPopup').modal('hide');
    e.preventDefault();
  });

  $(document).on('click', '.username', function() {
    var username = $(this).text();
    textarea.value = textarea.value + '@' + username;
    textarea.focus();
  });

  $('input[type="checkbox"]').each(function() {
    if(localStorage.getItem($(this).attr('id')) !== null) {
      $(this).attr("checked", "checked");
    }
  });

  $('input[type="checkbox"]').click(function () {
    if($(this).is(':checked')) {
      localStorage.setItem($(this).attr('id'), $(this).val());
    } else {
      localStorage.removeItem($(this).attr('id'));
    }
  });

  $(document).on('click', '.disclose', function() {
    $(this).prev().show(200);
    $(this).text("Cacher l'image");
    $(this).addClass('hide').removeClass('disclose');
  });

  $(document).on('click', '.hide', function() {
    $(this).prev().hide(200);
    $(this).text("Afficher l'image");
    $(this).addClass('disclose').removeClass('hide');
  });

  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });

  function updateTime() {
    $('[data-time]').each(function() {
      var time = $(this).data('time');
      if (time !== null) {
        time = moment(time).fromNow();
        $(this).text(time);
      }
    });
  }

  setInterval(updateTime, 20000); // every 2Osec

});
