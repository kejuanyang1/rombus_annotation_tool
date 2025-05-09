(define (problem scene1)
  (:domain manip)
  (:objects
    mango - item
    green pear - item
    potato - item
    green romaine lettuce - item
    big corn - item
    big green shopping basket - container
    green bowl - container
    green lid - lid
  )
  (:init
    (ontable mango)
    (ontable green pear)
    (ontable green romaine lettuce)
    (ontable big corn)
    (ontable green lid)
    (in potato big green shopping basket)
    (ontable big green shopping basket)
    (ontable green bowl)
    (closed green bowl)
    (handempty)
    (clear mango)
    (clear green pear)
    (clear green romaine lettuce)
    (clear big corn)
    (clear green lid)
    (clear big green shopping basket)
    (clear green bowl)
  )
  (:goal (and ))
)